import { Component, ViewChild } from '@angular/core';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverInfoComponent } from '../popovers/popover-info/popover-info.component';
import { IonTabs } from '@ionic/angular';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  myImage = null;
  imageTitle: string;
  imageDateCreated: string;
  imageSize: string;
  imageType: string;
  imageHeight: string;
  imageWidth: string;
  isMobile = Capacitor.getPlatform() !== 'web';

  constructor(
    private loadingController: LoadingController,
    public popoverController: PopoverController,
    private tabs: IonTabs
  ) {}

  // select image from device
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });

    // loading event
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();

    // if user is trying to upload the same file then do not upload it again

    this.myImage = `data:image/jpeg;base64,${image.base64String}`;

    // do not show loading event if user is trying to upload the same file
    if (this.myImage !== null) {
      loading.dismiss();
    }

    this.getImageInfo(image);
  }

  async getImageInfo(image: Photo) {
    // get image info
    const img = new Image();
    img.src = this.myImage;

    img.onload = () => {
      this.saveToLocalStorage();
      this.imageWidth = `${img.width} px`;
      this.imageHeight = `${img.height} px`;

      // check image ratio is lower than 1:1 then cut the image to 1:1
      if (img.width < img.height) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.width;
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.width,
          0,
          0,
          img.width,
          img.width
        );
        this.myImage = canvas.toDataURL();
      }

      const size = image.base64String.length * 0.75;
      this.imageSize = `${(size / 1024).toFixed(2)} KB`;
      this.imageType = image.format;

      // get image date of creation from file system (not from camera)
      const file = new File(
        [this.dataURItoBlob(this.myImage)],
        `${this.createFileName(image)}`,
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

  // create a function to save loaded image into local storage
  saveToLocalStorage() {
    const data = this.myImage;
    const blob = this.dataURItoBlob(data);
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result;
      this.saveFile(base64data);
    };
  }

  // convert dataURI to blob
  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  // save file to local storage
  saveFile(base64data: any) {
    const blob = this.dataURItoBlob(base64data);
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      base64data = reader.result;
      localStorage.setItem('image', base64data.toString());
    };
  }

  imageLoaded() {
    this.loadingController.dismiss();
  }

  // TODO: call this method to avoid user input mistake
  loadImageFailed() {
    console.log('Image load failed');
  }

  async additionalInfo(e: Event) {
    const popover = await this.popoverController.create({
      component: PopoverInfoComponent,
      event: e,
    });

    await popover.present();
    await popover.onDidDismiss();
  }

  deleteLoadedImage() {
    this.myImage = null;
    localStorage.clear();
  }

  acceptImage() {
    if (this.myImage) {
      this.tabs.select('tab2');
    }
  }
}
