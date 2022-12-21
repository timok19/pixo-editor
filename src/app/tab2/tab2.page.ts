import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  myImage = null;
  constructor(private router: Router) {}

  getImage() {
    this.myImage = localStorage.getItem('image');
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.getImage();
    });
  }
}
