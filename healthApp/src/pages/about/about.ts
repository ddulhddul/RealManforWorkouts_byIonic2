import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
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
  date: Date = new Date();

  constructor(public navCtrl: NavController, 
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

  ionViewCanLeave(){
    return new Promise((resolve: Function, reject: Function) => {
      this.done(resolve);
    })
  }
  
  getParamWorkout(){
    
    let paramData = this.navParams.get('date');

    if(paramData) this.date = paramData;
    let yyyymmdd = this.commonFunc.yyyymmdd(this.date.getTime());
    
    this.sql.query(`
      SELECT 
        HIST.WORKOUT_ID,
        IFNULL(W.WORKOUT_NAME, HIST.WORKOUT_NAME) WORKOUT_NAME,
        HIST.UNITS,
        HIST.GOAL,
        HIST.DONE,
        HIST.WEIGHT,
        HIST.WEIGHT_UNIT,
        W.IMG,
        HIST.WORKOUT_TIME
      FROM WORKOUT_HIST HIST
      LEFT OUTER JOIN WORKOUT W
      ON HIST.WORKOUT_ID = W.WORKOUT_ID
      WHERE HIST.DATE_YMD = '${yyyymmdd}'
      ORDER BY HIST.WORKOUT_ORDER
    `).then((res)=>{
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
            result.DONE
          ));
          this.cumTime = result.WORKOUT_TIME;
          this.dpTime = this.commonFunc.timeToDpTime(result.WORKOUT_TIME);
      }
    }).catch(err=>console.log('err',err))
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
  }

  start(){
    if(this.isStarted) return;
    this.isStarted = true;
    this.editable = false;
    let timer = Observable.timer(0, 1000);
    this.subscription = timer.subscribe(t => {
      this.time = this.cumTime + t;
      this.dpTime = this.commonFunc.timeToDpTime(this.time);
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

  done(resolve?){
    this.commonFunc.presentToast('Saved', 'top', '');
    this.stop();
    let yyyymmdd = this.commonFunc.yyyymmdd(this.date.getTime());
    this.sql.query(`DELETE FROM WORKOUT_HIST WHERE DATE_YMD = ${yyyymmdd}`).then((res)=>{

      let workouts = this.workouts;
      for (let i = 0; i < workouts.length; i++) {
        let element = workouts[i];
        let units = element.units.join(",");

        this.sql.query(`
          INSERT INTO WORKOUT_HIST(
              DATE_YMD,
              WORKOUT_ORDER,
              WORKOUT_ID,
              WORKOUT_NAME,
              WORKOUT_TIME,
              GOAL,
              DONE,
              WEIGHT,
              WEIGHT_UNIT,
              UNITS
          ) VALUES (
              '${yyyymmdd}',
              ${i+1},
              '${element.id}',
              '${element.name}',
              ${this.cumTime},
              ${element.goal},
              ${element.done},
              '${element.weight}',
              '${element.weightUnit}',
              '${units}'
          )
        `).catch((err)=>console.log('Done Err',err))
        .then((res)=>{
          if(!resolve){
            if(i == workouts.length-1){
              if(this.navCtrl.canGoBack()){
                this.navCtrl.pop();
              }else{
                this.navCtrl.popToRoot;
              }
            }
          }else resolve();
        })
      }
    }).catch((err)=>console.log('Delete Hist Err', err))
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
