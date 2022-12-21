import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  editButtonOnTabMenuStatus = true;

  imagesIcon: string;
  filterIcon: string;
  settingsIcon: string;
  myImage = null;

  constructor(private router: Router) {}

  setIcon() {
    if (this.router.url === '/tabs/tab1') {
      this.imagesIcon = 'images';
      this.filterIcon = 'options-outline';
      this.settingsIcon = 'settings-outline';
    } else if (this.router.url === '/tabs/tab2') {
      this.imagesIcon = 'images-outline';
      this.filterIcon = 'options';
      this.settingsIcon = 'settings-outline';
    } else if (this.router.url === '/tabs/tab3') {
      this.imagesIcon = 'images-outline';
      this.filterIcon = 'options-outline';
      this.settingsIcon = 'settings';
    }

    return this.imagesIcon, this.filterIcon, this.settingsIcon;
  }

  async getImage() {
    this.myImage = localStorage.getItem('image');
    return this.myImage;
  }

  // call function setIcon() when route changes
  ngOnInit() {
    this.router.events.subscribe(() => {
      this.setIcon();
      this.getImage();
    });
  }
}
