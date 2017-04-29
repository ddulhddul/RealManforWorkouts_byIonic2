import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
import { Storage } from '@ionic/storage';
import { Common } from '../../common/common';
import { SqlStorage } from '../../common/sql';
import { TemplatePage } from '../template/template';
import { workoutForm } from '../workout/workoutForm';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  isStarted: boolean;
  editable: boolean;
  time: number;
  dpTime: string;
  cumTime: number;
  subscription: Subscription;
  workouts: Array<workoutForm> = [];
  date: Date;

  constructor(public navCtrl: NavController, 
              public storage: Storage,
              private navParams: NavParams,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public sql: SqlStorage,
              public commonFunc: Common
              ) {
    
    this.setDefault();
    this.getParamWorkout();
    
  }

  getParamWorkout(){
    if(this.navParams){
      this.date = this.navParams.get('date') || new Date();
      this.storage.ready().then(() => {
        this.storage.get('workout'+this.commonFunc.yyyymmdd(this.date.getTime())).then((val) => {
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
    this.editable = false;
    this.time = 0;
    this.cumTime = 0;
    this.dpTime = '00:00:00';
    this.isStarted = false;
    let workouts = this.workouts;
    for (let i = 0; i < workouts.length; i++) {
      let element = workouts[i];
      element.done = 0;
    }
    this.date = new Date();
  }

  start(){
    if(this.isStarted) return;
    this.isStarted = true;
    this.editable = false;
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

  done(){
    this.commonFunc.presentToast('Saved', 'top', '');
    this.stop();
    this.storage.ready().then(() => {
        let json = {workouts:[], time: 0, dpTime: '', cumTime: 0};
        json.workouts = this.workouts;
        json.time = this.time;
        json.cumTime = this.cumTime;
        json.dpTime = this.dpTime;
        this.storage.set('workout'+this.commonFunc.yyyymmdd(this.date.getTime()), JSON.stringify(json));
        if(this.navCtrl.canGoBack()){
          this.navCtrl.pop();
        }else{
          this.navCtrl.popToRoot;
        }
    });
  }

  editDone(){
    if(document.getElementsByClassName('ng-invalid').length == 0) this.editable=false;
  }

  addTemplate(){
    let params = {isModal:true};
    let modal = this.modalCtrl.create(TemplatePage, params);
    modal.present();
    modal.onDidDismiss((data) => {
      if(data){
        this.workouts = [];
        this.sql.query(`
          SELECT 
            T.WORKOUT_ID,
            IFNULL(W.WORKOUT_NAME, T.WORKOUT_NAME) WORKOUT_NAME,
            T.UNITS,
            T.GOAL,
            T.WEIGHT,
            T.WEIGHT_UNIT,
            W.IMG
          FROM WORKOUT_TEMPLATE T
          LEFT OUTER JOIN WORKOUT W
          ON T.WORKOUT_ID = W.WORKOUT_ID
          WHERE T.TEMPLATE_NO = ${data.TEMPLATE_NO}
        `).then((res)=>{
          if(res.res){
              let rows = res.res.rows;
              for (let i = 0; i < rows.length; i++) {
                  let result = rows[i];
                  let units = result.UNITS.split(',')
                  this.workouts.push(new workoutForm(
                    result.WORKOUT_ID,
                    result.WORKOUT_NAME,
                    units,
                    result.GOAL,
                    result.IMG,
                    units[0],
                    units[1],
                    units[2],
                    result.WEIGHT,
                    result.WEIGHT_UNIT,
                    0
                  ));
              }
          }
        }).catch((err)=>{
          console.log('Call Template Err...', err);
        })
      } 
    });
  }

}
