import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../about/about';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import * as Common from '../../common/common';

@Component({
  selector: 'workoutlist',
  templateUrl: 'workoutlist.html'
})
export class ListPage {
    daysUnit: number = 30;
    curDate: Date;
    workoutList: Array<any>;
    
    constructor(
            public storage: Storage,
            public navCtrl: NavController,
            public toastCtrl: ToastController,
            public alertCtrl: AlertController
        ) {
    }

    setDefault(){
        this.workoutList = [];
        this.curDate = new Date();
        
        this.storage.ready().then(() => {

            //today's data
            let curDateTime = this.curDate.getTime();
            let yyyymmdd = Common.yyyymmdd(curDateTime);
            let pushObj;
            this.storage.get('workout'+yyyymmdd).then((val) => {
                pushObj = {date:null};
                if(val) pushObj = JSON.parse(val);
                pushObj.date = new Date(curDateTime);
                this.workoutList.push(pushObj);
                this.getWorkoutList();
            })
        });
    }

    getWorkoutList(){
        this.storage.ready().then(() => {
            //history data load
            let yyyymmdd, pushObj;
            for (let i = 1; i <= this.daysUnit; i++) {
                let dateNum = this.curDate.setDate(this.curDate.getDate()-1);
                yyyymmdd = Common.yyyymmdd(dateNum);
                this.storage.get('workout'+yyyymmdd).then((val) => {
                    pushObj = {date:null};
                    if(val) pushObj = JSON.parse(val);
                    pushObj.date = new Date(dateNum);
                    this.workoutList.push(pushObj);
                })
            }
        });
    }

    doInfinite(infiniteScroll) {

        setTimeout(() => {
            this.getWorkoutList();
            infiniteScroll.complete();
        }, 500);
    }

    goWorkoutPage(date:Date){
        this.navCtrl.push(AboutPage, {date: date});
    }

    ionViewWillEnter(){
        this.setDefault();
    }

    delWorkoutYmd(date, index){
        let yyyymmdd = Common.yyyymmdd(date);
        let confirm = this.alertCtrl.create({
            title: 'Delete',
            message: 'Would you like to delete '+yyyymmdd+'\'s history?',
            buttons: [
                {
                    text: 'Disagree',
                    handler: () => {
                        
                    }
                },
                {
                    text: 'Agree',
                    handler: () => {
                        this.workoutList[index] = {date: date};
                        this.storage.ready().then(() => {
                            this.storage.remove('workout'+yyyymmdd);
                            Common.presentToast(this.toastCtrl, yyyymmdd+'\'s Workout History Deleted.', 'top', '');
                        });
                    }
                }
            ]
        });
        confirm.present();
    }
}
