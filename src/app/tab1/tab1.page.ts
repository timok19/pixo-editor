import { Component, ViewChild } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverInfoComponent } from '../popovers/popover-info/popover-info.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  myImage = null;

  imageDateCreated: string;
  imageName: string;
  imageSize: string;
  imageType: string;
  imageResolution: string;

  isMobile = Capacitor.getPlatform() !== 'web';

  constructor(
    private loadingController: LoadingController,
    public popoverController: PopoverController
  ) {}

  // select image from device
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });

    // loading event
    const loading = await this.loadingController.create();
    await loading.present();

    this.myImage = `data:image/jpeg/png/jpg;base64,${image.base64String}`;

    const img = new Image();
    img.src = this.myImage;

    img.onload = () => {
      this.imageResolution = `${img.width} px ✕ ${img.height} px`;

      const size = image.base64String.length * 0.75;
      this.imageSize = `${(size / 1024).toFixed(2)} KB`;

      this.imageType = image.format;

      // get image name from file system (not from EXIF) because EXIF data is not always available on mobile devices
      this.imageName = this.myImage.name;
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

  // TODO: call this method accept user input
  acceptImage() {}
}
