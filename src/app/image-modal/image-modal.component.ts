import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageInfoService } from '../tab1/image-info.service';
import SwiperCore, {
  Keyboard,
  Pagination,
  Scrollbar,
  SwiperOptions,
  Zoom,
} from 'swiper';

SwiperCore.use([Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageModalComponent implements OnInit {
  @Input() myImage: string;

  constructor(
    private modalController: ModalController,
    public imageInfoService: ImageInfoService
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {}
}
