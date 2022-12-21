import { Component, ViewChild } from '@angular/core';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverInfoComponent } from '../popovers/popover-info/popover-info.component';
import { IonTabs } from '@ionic/angular';
import { TabsPage } from '../tabs/tabs.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  myImage = null;
  displayImage = null;
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
    private tabs: IonTabs,
    private tabsPage: TabsPage
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

    img.onload = async () => {
      this.imageWidth = `${img.width} px`;
      this.imageHeight = `${img.height} px`;

      this.setFrameAspectRatio(img, 16, 9);

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
      await this.saveToLocalStorage();
    };
  }

  setFrameAspectRatio(img: HTMLImageElement, width: number, height: number) {
    if (img.width > 300 && img.height > 300) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.width * (height / width);

      // calculate the source x and y coordinates to cut the image
      const sx = 0;
      const sy = (img.height - canvas.height) / 2;

      ctx.drawImage(
        img,
        sx,
        sy,
        img.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      if (img.width >= 3000 && img.height >= 3000) {
        this.displayImage = this.myImage = canvas.toDataURL('image/jpeg', 0.7);
      } else {
        this.displayImage = canvas.toDataURL();
      }
    }
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
  async saveToLocalStorage() {
    const data = this.myImage;
    const blob = this.dataURItoBlob(data);
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result;
      localStorage.clear();
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
    this.tabsPage.editButtonOnTabMenuStatus = true;
  }

  acceptImage() {
    if (this.myImage) {
      this.tabs.select('tab2');
      this.tabsPage.editButtonOnTabMenuStatus = false;
    }
  }
}
