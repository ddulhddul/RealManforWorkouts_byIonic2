import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'common',
  template: ''
})
export class Common{
    constructor(
        public navCtrl: NavController, 
        public storage: Storage,
        private navParams: NavParams,
        public toastCtrl: ToastController  
    ){}
    presentToast(msg, position){
        
        //top, middle, bottom
        let toast = this.toastCtrl.create({
            message: msg,
            position: position,
            duration: 3000
        });
        toast.present();
    }

}