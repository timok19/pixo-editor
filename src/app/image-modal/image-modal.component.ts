import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageInfoService } from '../tab1/image-info.service';
import { SwiperOptions } from 'swiper';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
@Injectable({ providedIn: 'root' })
export class ImageModalComponent {
  @Input() myImage: string;

  modal: HTMLIonModalElement;

  swiperConfig: SwiperOptions = {
    initialSlide: 1,
    direction: 'vertical',
  };

  constructor(
    public modalController: ModalController,
    public imageInfoService: ImageInfoService
  ) {}

  async openImageModal(image: string) {
    this.modal = await this.modalController.create({
      component: ImageModalComponent, // Reference the modal component
      componentProps: {
        myImage: image,
      },
    });
    return await this.modal.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
