import { Component, ViewChild } from '@angular/core';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverInfoComponent } from '../popovers/popover-info/popover-info.component';
import { IonTabs } from '@ionic/angular';
import { TabsPage } from '../tabs/tabs.page';
import { ImageInfoService } from './image-info.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  myImage = null;

  isMobile = Capacitor.getPlatform() !== 'web';

  constructor(
    private loadingController: LoadingController,
    public popoverController: PopoverController,
    private tabs: IonTabs,
    private tabsPage: TabsPage,
    public imageInfoService: ImageInfoService
  ) {}

  // select image from device
  async selectImage() {
    const imageFromDevice = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    // loading event
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();

    // if user is trying to upload the same file then do not upload it again

    this.myImage = `data:image/jpeg;base64,${imageFromDevice.base64String}`;

    // do not show loading event if user is trying to upload the same file
    const imageElement = new Image();
    imageElement.src = this.myImage;

    // wait for the image to load before dismissing the loading spinner
    imageElement.onload = async () => {
      // do not show loading event if user is trying to upload the same file
      while (!imageElement.complete) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };
    this.imageInfoService.getImageInfo(imageFromDevice, this.myImage);
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
