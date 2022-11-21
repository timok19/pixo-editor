import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  filledImagesIcon = true;
  filledFilterIcon = true;
  filledSettingsIcon = true;

  isImagesClicked = true;
  isEditClicked = true;
  isSettingsClicked = true;

  constructor() {}

  imagesIconSet(): boolean {
    this.filledImagesIcon = !this.filledImagesIcon;
    return this.filledImagesIcon;
  }
  filterIconSet(): boolean {
    this.filledFilterIcon = !this.filledFilterIcon;
    return this.filledFilterIcon;
  }
  settingsIconSet(): boolean {
    this.filledSettingsIcon = !this.filledSettingsIcon;
    return this.filledSettingsIcon;
  }
}
