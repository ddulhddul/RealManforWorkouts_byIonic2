import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { Platform, NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  appVersion:string = '0.0.0';

  constructor(public navCtrl: NavController,
              public app: AppVersion,
              public platform: Platform) {
    this.getVersionCode();
  }

  async getVersionCode() {
    if(this.platform.is('android')){
      const versionCode = await this.app.getVersionCode();
      this.appVersion = versionCode;
    }
  }

}
