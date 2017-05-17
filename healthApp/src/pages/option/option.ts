import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Common } from '../../common/common';
import { SqlStorage } from '../../common/sql';

@Component({
  selector: 'page-option',
  templateUrl: 'option.html'
})
export class OptionPage {

    constructor(
            public storage: Storage,
            public navCtrl: NavController,
            public toastCtrl: ToastController,
            public sql: SqlStorage,
            public commonFunc: Common,
            public alertCtrl: AlertController){

    }

    createInit(){
        let initQueuries = this.commonFunc.sqlStorageInit();
        for (let i = 0; i < initQueuries.length; i++) {
            this.sql.query(
                initQueuries[i]
                ).catch(err => {
                console.error('Storage: Unable to create initial storage tables', err.tx, err.err);
            });
        }
        this.commonFunc.presentToast('Workout Created', 'top');

    }

    initWorkouts(){
        let initQueuries = this.commonFunc.dropSql['workout']
                            .concat(this.commonFunc.createSql['workout'])
                            .concat(this.commonFunc.insertSql['workout'])
        for (let i = 0; i < initQueuries.length; i++) {
            this.sql.query(
                initQueuries[i]
                ).catch(err => {
                console.error('Storage: Unable to create initial storage tables', err);
            });
        }
        this.commonFunc.presentToast('Workout Init', 'top');

    }

}
