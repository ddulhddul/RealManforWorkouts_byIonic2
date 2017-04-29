import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { Common } from '../../common/common';
import { SqlStorage } from '../../common/sql';

@Component({
  selector: 'workoutlist',
  templateUrl: 'workoutlist.html'
})
export class ListPage {
    daysUnit: number = 30;
    curDate: Date;
    workoutList: Array<any> = [];
    
    constructor(
            public navCtrl: NavController,
            public toastCtrl: ToastController,
            public alertCtrl: AlertController,
            public sql: SqlStorage,
            public commonFunc: Common
        ) {
    }

    getWorkoutList(init?){
        if(init || this.workoutList.length == 0){
            this.workoutList = [];
            this.curDate = new Date();
        }else{
            this.curDate = new Date(this.workoutList[this.workoutList.length-1].date.getTime());
            this.curDate.setDate(this.curDate.getDate()-1);
        }
        
        let endDate = this.commonFunc.yyyymmdd(this.curDate.getTime());
        this.curDate.setDate(this.curDate.getDate()-this.daysUnit);
        let startDate = this.commonFunc.yyyymmdd(this.curDate.getTime());
        
        this.sql.query(`
            SELECT
                IFNULL(H.WORKOUT_NAME,W.WORKOUT_NAME) WORKOUT_NAME,
                H.WEIGHT,
                H.WEIGHT_UNIT,
                H.GOAL,
                H.DONE,
                H.WORKOUT_TIME,
                H.DATE_YMD
            FROM WORKOUT_HIST H
            LEFT OUTER JOIN WORKOUT W
            ON H.WORKOUT_ID = W.WORKOUT_ID
            WHERE H.DATE_YMD BETWEEN '${startDate}' AND '${endDate}'
            ORDER BY H.DATE_YMD DESC, H.WORKOUT_ORDER ASC
        `).then((res)=>{
            let rows = res.res.rows;
            let y = Number(endDate.substr(0,4)),
                m = Number(endDate.substr(4,2)) - 1,
                d = Number(endDate.substr(6,2));
            let tempDate = new Date(y,m,d);
            let curYYYYMMDD = this.commonFunc.yyyymmdd(tempDate.getTime());
            
            let rowLen = rows.length;
            let index = 0;
            do{
                if(index < rowLen){
                    let workouts = [];
                    let cumTime;
                    for (; index < rowLen; index++) {
                        let param = rows[index];
                        if(curYYYYMMDD == param.DATE_YMD){
                            workouts.push({
                                name : param.WORKOUT_NAME,
                                goal : param.GOAL,
                                done : param.DONE,
                                weight : param.WEIGHT,
                                weightUnit : param.WEIGHT_UNIT
                            })
                            cumTime = param.WORKOUT_TIME
                        }else break;
                    }
                    this.workoutList.push({
                        date : new Date(tempDate.getTime()),
                        dpTime : cumTime ? this.commonFunc.timeToDpTime(cumTime): '',
                        workouts: workouts
                    });
                }else{
                    this.workoutList.push({
                        date : new Date(tempDate.getTime())
                    });
                }
                tempDate.setDate(tempDate.getDate()-1);
                curYYYYMMDD = this.commonFunc.yyyymmdd(tempDate.getTime());
            }while(curYYYYMMDD > startDate)

        }).catch((err)=>console.log('select hist err', err))

    }

    doInfinite(infiniteScroll) {

        setTimeout(() => {
            this.getWorkoutList();
            infiniteScroll.complete();
        }, 1000);
    }

    goWorkoutPage(date:Date){
        this.navCtrl.push(AboutPage, {date: date});
    }

    ionViewWillEnter(){
        this.getWorkoutList('init');
    }

    delWorkoutYmd(date, index){
        let yyyymmdd = this.commonFunc.yyyymmdd(date);
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
                        let yyyymmdd = this.commonFunc.yyyymmdd(this.workoutList[index].date.getTime());
                        this.sql.query(`DELETE FROM WORKOUT_HIST WHERE DATE_YMD = '${yyyymmdd}'`).then((res)=>{
                            this.workoutList[index] = {date: date};
                            this.commonFunc.presentToast(yyyymmdd+'\'s Workout History Deleted.', 'top', '');

                        }).catch((err)=>{
                            console.log('delete err...',err);
                        })
                    }
                }
            ]
        });
        confirm.present();
    }
}
