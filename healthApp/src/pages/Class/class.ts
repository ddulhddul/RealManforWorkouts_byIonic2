import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as Common from '../../common/common';

@Component({
  selector: 'page-class',
  templateUrl: 'class.html'
})
export class ClassPage {

    classes:Array<any>;

  constructor(
      public navCtrl: NavController,
      public storage: Storage) {
    
    this.storage.ready().then(() => {
        this.storage.get('workoutClass').then((val) => {
          if(val){
              this.classes = JSON.parse(val);
          }else{
              this.classes = [];
          }
        });
    });
  }

}
