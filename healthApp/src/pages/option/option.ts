import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { Common } from '../../common/common';
import { SqlStorage } from '../../common/sql';

@Component({
  selector: 'page-option',
  templateUrl: 'option.html'
})
export class OptionPage {
    initWorkouts: any;
    deleteHistories: any;
    deleteTemplates: any;

    constructor(
            public navCtrl: NavController,
            public toastCtrl: ToastController,
            public sql: SqlStorage,
            public commonFunc: Common,
            public alertCtrl: AlertController){
        
        this.initWorkouts = ()=>{
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
            this.commonFunc.presentToast('Workouts Initted.', 'top');
        }
        this.deleteHistories = ()=>{
            this.sql.query(
                `DELETE FROM WORKOUT_HIST`
            ).catch(err => {
                console.error('Storage: Unable to delete history table', err);
            }).then((res)=>{
                this.commonFunc.presentToast('History Datas Deleted.', 'top');
            })
        }
        this.deleteTemplates = ()=>{
            this.sql.query(
                `DELETE FROM WORKOUT_TEMPLATE`
            ).catch(err => {
                console.error('Storage: Unable to delete template table', err);
            }).then((res)=>{
                this.commonFunc.presentToast('Template Datas Deleted.', 'top');
            })
        }
    }

    confirmMsg(msg:string, callbackFunc){
        let confirm = this.alertCtrl.create({
            title: 'Warning',
            message: msg,
            buttons: [
                {text: 'Disagree',handler: () => {}},
                {text: 'Agree',handler: () => {callbackFunc()}}
            ]
        });
        confirm.present();
    }

    

}
