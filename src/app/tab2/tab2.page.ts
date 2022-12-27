import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../tab1/local-storage.service';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild('blackContainer') blackContainer: ElementRef<HTMLDivElement>;

  myImage = null;
  height: string;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private modalController: ModalController
  ) {}

  changeHeightOfSettingsBox() {
    const childElements = this.blackContainer.nativeElement.children;
    const height = childElements.length * 50;
    this.blackContainer.nativeElement.style.height = `${height}px`;
  }

  async getImage() {
    if (localStorage.getItem('image')) {
      this.myImage = localStorage.getItem('image');
    } else {
      this.myImage = await this.localStorageService.getLargeImage();
    }
  }

  async openImageModal(image: string) {
    const modal = await this.modalController.create({
      component: ImageModalComponent, // Reference the modal component
      componentProps: {
        myImage: image,
      },
    });
    return await modal.present();
  }

  async setFilter() {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.getImage();
      this.changeHeightOfSettingsBox();
    });
  }
}
