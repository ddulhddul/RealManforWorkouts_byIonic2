import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../about/about';
import { NavController, ToastController, AlertController } from 'ionic-angular';

@Component({
  selector: 'workoutlist',
  templateUrl: 'workoutlist.html'
})
export class ListPage {
    dateList: Array<number>;
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
        this.dateList = [];
        this.workoutList = [];
        this.curDate = new Date();
        this.dateList.push(this.curDate.getTime());
        for (let i = 1; i <= this.daysUnit; i++) {
            this.dateList.push( 
                this.curDate.setDate(this.curDate.getDate()-1)
            );
        }
        this.getWorkoutList();  
    }

    getWorkoutList(){
        this.storage.ready().then(() => {
            for(let i = this.workoutList.length; i < this.dateList.length; i++){
                let yyyymmdd = this.yyyymmdd(this.dateList[i]);
                this.storage.get('workout'+yyyymmdd).then((val) => {
                    let pushObj = ''
                    if(val){
                        val = JSON.parse(val);
                        if(val.workouts) pushObj = val.workouts;
                    }
                    this.workoutList.push(pushObj);
                })
            }
        });
    }

    yyyymmdd(dateNum){
        let date = new Date(dateNum);
        let yyyy = date.getFullYear();
        let mm:any = date.getMonth()+1;
        let dd:any = date.getDate();
        
        return yyyy+(mm<10?'0'+mm:mm)+(dd<10?'0'+dd:dd);
    }

    doInfinite(infiniteScroll) {

        setTimeout(() => {
            for (let i = 1; i <= this.daysUnit; i++) {
                this.dateList.push( 
                    this.curDate.setDate(this.curDate.getDate()-1)
                );
            }
            this.getWorkoutList();
            infiniteScroll.complete();
        }, 500);
    }

    goWorkoutPage(dateNum){
        console.log(dateNum, this.yyyymmdd(dateNum))
        this.navCtrl.push(AboutPage, {date_ymd: this.yyyymmdd(dateNum)});
    }

    ionViewWillEnter(){
        this.setDefault();
    }

    delWorkoutYmd(date, index){
        let yyyymmdd = this.yyyymmdd(date);
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
                        this.workoutList[index] = '';
                        this.storage.ready().then(() => {
                            this.storage.remove('workout'+yyyymmdd);
                            this.presentToast(yyyymmdd+'\'s Workout History Deleted.', 'top');
                        });
                    }
                }
            ]
        });
        confirm.present();

        
    }

    presentToast(msg, position) {
        //top, middle, bottom
        let toast = this.toastCtrl.create({
            message: msg,
            position: position,
            duration: 3000
        });
        toast.present();
    }

    delAll(){
              
        let confirm = this.alertCtrl.create({
            title: 'Delete',
            message: 'Would you like to delete all the history?',
            buttons: [
                {
                    text: 'Disagree',
                    handler: () => {
                        
                    }
                },
                {
                    text: 'Agree',
                    handler: () => {
                        this.storage.ready().then(() => {
                            this.storage.clear();
                            this.presentToast('Workout History Deleted.', 'top');
                            this.setDefault();
                        });  
                    }
                }
            ]
        });
        confirm.present();

    }

}
