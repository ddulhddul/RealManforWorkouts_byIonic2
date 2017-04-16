import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
import { Storage } from '@ionic/storage';
import * as Common from '../../common/common';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  isStarted: boolean;
  time: number;
  dpTime: string;
  cumTime: number;
  subscription: Subscription;
  workouts: Array<any>;
  date: Date;

  constructor(public navCtrl: NavController, 
              public storage: Storage,
              private navParams: NavParams,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController
              ) {
    this.setDefault();
    this.getParamWorkout();
    
  }

  getParamWorkout(){
    if(this.navParams){
      this.date = this.navParams.get('date') || new Date();
      this.storage.ready().then(() => {
        this.storage.get('workout'+Common.yyyymmdd(this.date.getTime())).then((val) => {
            if(val){
              let json = JSON.parse(val);
              
              this.workouts = json.workouts;
              this.time = json.time;
              this.cumTime = json.cumTime;
              this.dpTime = json.dpTime;
            } 
        })
      });
    }
  }

  setDefault(){
    this.time = 0;
    this.cumTime = 0;
    this.dpTime = '00:00:00';
    this.isStarted = false;
    this.workouts = [
      {
        workoutId: 'pushUp',
        name: 'Push Up',
        done: 0,
        goal: 100,
        units: [5,10,15],
        img: 'pushUp'
      },
      {
        workoutId: 'dumbel',
        name: 'Dumbel',
        done: 0,
        goal: 100,
        units: [5,10,15],
        weight: 7,
        weightUnit: 'kg',
        img: 'dumbel'
      }
    ];
    this.date = new Date();
  }

  start(){
    if(this.isStarted) return;
    this.isStarted = true;
    let timer = Observable.timer(0, 1000);
    this.subscription = timer.subscribe(t => {
      this.time = this.cumTime + t;
      let time = this.time;
      let hour = Math.floor(time/3600); time=time%3600
      let min = Math.floor(time/60); 
      let sec = time%60;

      let preHour = '';
      let preMin = ':';
      let preSec = ':';
      if(hour<10) preHour = '0';
      if(min<10) preMin = ':0';
      if(sec<10) preSec = ':0';
      
      this.dpTime = preHour+hour+preMin+min+preSec+sec;
    });
  }
  stop(){
    this.isStarted = false;
    this.cumTime = this.time;
    !this.subscription || this.subscription.unsubscribe();
  }
  reset(){

    let confirm = this.alertCtrl.create({
        title: 'Delete',
        message: 'Would you like to reset current workout history?',
        buttons: [
            {
                text: 'Disagree',
                handler: () => {
                }
            },
            {
                text: 'Agree',
                handler: () => {
                    this.setDefault();
                    !this.subscription || this.subscription.unsubscribe();
                }
            }
        ]
    });
    confirm.present();
  }

  workoutClick(workout, unit){
    if(!this.isStarted) this.start();
    workout.done += unit;
    Common.presentToast(this.toastCtrl, '+'+unit, 'top', '1000');
    workout.message = this.dpTime;
  }

  done(){
    Common.presentToast(this.toastCtrl, 'Saved', 'top', '');
    this.stop();
    this.storage.ready().then(() => {
        let json = {workouts:[], time: 0, dpTime: '', cumTime: 0};
        json.workouts = this.workouts;
        json.time = this.time;
        json.cumTime = this.cumTime;
        json.dpTime = this.dpTime;
        this.storage.set('workout'+Common.yyyymmdd(this.date.getTime()), JSON.stringify(json));
        if(this.navCtrl.canGoBack()){
          this.navCtrl.pop();
        }else{
          this.navCtrl.popToRoot;
        }
    });
  }

  defaultImg(workout){
    Common.defaultImg(workout);
  }
}
