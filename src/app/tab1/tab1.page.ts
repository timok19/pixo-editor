import { Component, ViewChild } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import * as anime from 'animejs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  croppedImage: any = '';
  myImage = null;

  isMobile = Capacitor.getPlatform() !== 'web';

  constructor(private loadingCtrl: LoadingController) {}

  // select image from device
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });

    // loading event
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.myImage = `data:image/jpeg;base64,${image.base64String}`;
    this.croppedImage = null;
  }

  // TODO: call this method to stop loading animation
  imageLoaded() {
    this.loadingCtrl.dismiss();
  }

  // TODO: call this method to avoid user input mistake
  loadImageFailed() {
    console.log('Image load failed');
  }

  cropImage() {}

  pulsationAnimation() {
    anime({
      targets: '.pulsating-circle',
      translateX: [
        { value: 100, duration: 1200 },
        { value: 0, duration: 800 },
      ],
      rotate: '1turn',
      duration: 2000,
    });
  }
}
