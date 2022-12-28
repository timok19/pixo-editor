import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../tab1/local-storage.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild('blackContainer') blackContainer: ElementRef<HTMLDivElement>;

  myImage = null;

  invert = true;
  free = true;
  charm = true;
  blackAndWhite = true;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    public imageModalComponent: ImageModalComponent
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

  setFilter(filterName: boolean) {
    if (filterName === this.invert) {
      this.invert = !this.invert;
    }
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.getImage();
      this.changeHeightOfSettingsBox();
    });
  }
}
