import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Photo } from '@capacitor/camera';

@Injectable({ providedIn: 'root' })
export class ImageInfoService {
  imageTitle: string;
  imageDateCreated: string;
  imageSize: string;
  imageType: string;
  imageHeight: string;
  imageWidth: string;
  displayImage = null;

  constructor(private localStorageService: LocalStorageService) {}

  async getImageInfo(imageProps: Photo, myImage: string) {
    // get image info
    const img = new Image();
    img.src = myImage;

    img.onload = async () => {
      this.imageWidth = `${img.width} px`;
      this.imageHeight = `${img.height} px`;

      this.setFrameAspectRatioOfImagePreview(myImage, img, 16, 9);

      const size = imageProps.base64String.length * 0.75;
      this.imageSize = `${(size / 1024).toFixed(2)} KB`;
      this.imageType = imageProps.format;

      // get image date of creation from file system (not from camera)
      const file = new File(
        [this.localStorageService.dataURItoBlob(myImage)],
        `${this.createFileName(imageProps)}`,
        {
          type: 'image/jpeg',
        }
      );

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.imageTitle = file.name;
        this.imageDateCreated = new Date(file.lastModified)
          .toLocaleDateString('en-UK', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })
          .replace(/\//g, '-');
      };
      await this.localStorageService.saveToLocalStorage(myImage);
    };
  }

  createFileName(image: Photo): string {
    const currentDate = new Date();

    // format the date as a string
    const formattedDate = currentDate.toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    // do not use slashes in the file name
    const formattedDateNoSlash = formattedDate.replace(/\//g, '-');
    const fileName = `pixo-${formattedDateNoSlash}.${image.format}`;

    return fileName;
  }

  setFrameAspectRatioOfImagePreview(
    myImage: string,
    imgObjectOnPage: HTMLImageElement,
    width: number,
    height: number
  ) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imgObjectOnPage.width;
    canvas.height = imgObjectOnPage.width * (height / width);

    // calculate the source x and y coordinates to cut the image
    const sx = 0;
    const sy = (imgObjectOnPage.height - canvas.height) / 2;

    ctx.drawImage(
      imgObjectOnPage,
      sx,
      sy,
      imgObjectOnPage.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (imgObjectOnPage.width >= 3000 && imgObjectOnPage.height >= 3000) {
      this.displayImage = myImage = canvas.toDataURL('image/jpeg', 0.7);
    } else {
      this.displayImage = canvas.toDataURL();
    }
  }
}
