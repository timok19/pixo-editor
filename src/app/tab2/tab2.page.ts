import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  @ViewChild('blackContainer') blackContainer: ElementRef<HTMLDivElement>;
  @ViewChild('slides') slides: IonSlides;
  @ViewChild('imageEdit') imageEditElement: ElementRef;
  @ViewChild('imageEditCard') imageEditCardElement: ElementRef;
  @ViewChild('mySlides') mySlides: ElementRef;

  slidesOptions = {
    freeMode: true,
    loop: false,
    slidesPerView: 3,
  };

  myImage = null;

  constructor(private router: Router, private http: HTTP) {}

  changeHeightOfSettingsBox() {
    const childElements = this.blackContainer.nativeElement.children;
    const height = childElements.length * 50;
    this.blackContainer.nativeElement.style.height = `${height}px`;
  }

  getImage() {
    this.myImage = localStorage.getItem('image');
  }

  setFilter(filter: string) {}
  // TODO: Add first api request to add image into Pixoeditor API

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.getImage();
      this.changeHeightOfSettingsBox();
    });
  }
}
