import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-dummy',
  templateUrl: './dummy.html',
  styleUrl: './dummy.scss',
})
export class DummyPage {
  constructor(private menuCtrl: MenuController,
              public router: Router,
              public route: ActivatedRoute,) {
  }


  ionViewWillEnter() {
    this.enableNavigation(false);
  }

  ionViewWillLeave() {
    this.enableNavigation(true);
  }

  enableNavigation(enabled: boolean) {
    this.menuCtrl.enable(enabled);
    //this.menuCtrl.swipeEnable(enabled);
    //this.viewCtrl.showBackButton(enabled);
  }
}


