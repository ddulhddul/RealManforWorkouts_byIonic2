import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, LoadingController } from 'ionic-angular';
import { SqlStorage } from '../../common/sql';
import { Common } from '../../common/common';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {

    @ViewChild(Slides) slides: Slides;
    calendarFirstDate:Date;
    calendarArr:any;
    yyyy:Array<number>;
    mm:Array<number>;
    curYYYY:number;
    curMM:number;
    loading:any;
    today: Date = new Date();
    week;

    constructor(
            public navCtrl: NavController,
            public loadingCtrl: LoadingController,
            public commonFunc: Common,
            public sql: SqlStorage) {
        this.week = this.commonFunc.week;
        let curdate = new Date();
        this.yyyy = []; this.mm = [];
        let yyyy = curdate.getFullYear();
        for(let i=-1;i<100;i++) this.yyyy.push(yyyy-i);
        for(let i=1;i<=12;i++) this.mm.push(i);

        this.loading = this.loadingCtrl.create({
            content: `
                <div class="custom-spinner-container">
                    <div class="custom-spinner-box"></div>
                </div>`
        });

        this.defaultSet(curdate);
        // this.slides.lockSwipes(true);
    }

    ionViewWillEnter(){
        this.defaultSet(new Date(this.curYYYY, this.curMM-1, 1));
    }

    changeYYYY(val){
        this.defaultSet(new Date(val, this.curMM-1, 1));
    }

    changeMM(val){
        this.defaultSet(new Date(this.curYYYY, val-1, 1));
    }

    defaultSet(date:Date){
        date = date || new Date();
        this.calendarArr = [];       
        this.curYYYY = date.getFullYear();
        this.curMM = date.getMonth()+1;
        let date1 = new Date(date.getTime()),date2 = new Date(date.getTime()),date3 = new Date(date.getTime());
        date1 = new Date(date1.setMonth(date.getMonth()-1));
        date3 = new Date(date3.setMonth(date.getMonth()+1));

        this.showCalendar(date2);
        // this.showCalendar(date1, true);
        // this.showCalendar(date3);
    }

    showCalendar(date:Date, reverse?:boolean, callback?:any){
        let targetDate = date || new Date();
        
        let targetFirstDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        targetFirstDate.setDate(
            targetFirstDate.getDate() - targetFirstDate.getDay()
        );
        let targetLastDate = new Date(targetDate.getFullYear(), targetDate.getMonth()+1, 0);
        targetLastDate.setDate(
            targetLastDate.getDate() + (6-targetLastDate.getDay())
        );
        let startDate = this.commonFunc.yyyymmdd(targetFirstDate.getTime());
        let endDate = this.commonFunc.yyyymmdd(targetLastDate.getTime());
        
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
            ORDER BY H.DATE_YMD ASC, H.WORKOUT_ORDER ASC
        `).then((res)=>{
            let rows = res.res.rows;
            let y = Number(startDate.substr(0,4)),
                m = Number(startDate.substr(4,2)) - 1,
                d = Number(startDate.substr(6,2));
            let tempDate = new Date(y,m,d);
            let curYYYYMMDD = this.commonFunc.yyyymmdd(tempDate.getTime());
            
            let rowLen = rows.length;
            let index = 0;
            let doWhileCnt = 0;
            let calendar = [];
            let week = [];
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
                    week.push({
                        date : new Date(tempDate.getTime()),
                        cumTime: cumTime,
                        workouts: workouts
                    });
                }else{
                    week.push({
                        date : new Date(tempDate.getTime())
                    });
                }
                tempDate.setDate(tempDate.getDate()+1);
                curYYYYMMDD = this.commonFunc.yyyymmdd(tempDate.getTime());

                if(++doWhileCnt%7 == 0 && doWhileCnt>1){
                    calendar.push(week);
                    week = [];
                }
            }while(curYYYYMMDD <= endDate)
            
            // if(reverse){
            //     this.calendarArr.unshift({
            //         calendar: calendar,
            //         date: targetDate
            //     });

            // }else{
            //     this.calendarArr.push({
            //         calendar: calendar,
            //         date: targetDate
            //     });
            // }
            this.calendarArr = [{
                    calendar: calendar,
                    date: targetDate
                }];
            if(callback) callback();
            // this.loading.dismiss();

        }).catch(err=>{
            console.log('calendar select error', err);
            if(reverse){
                this.calendarArr.unshift({
                    date: targetDate
                });

            }else{
                this.calendarArr.push({
                    date: targetDate
                });
            }
            // this.loading.dismiss();
        })
    }

    prev(){
        // this.slides.slidePrev(500,true);
        this.slideChanged();
    }
    
    next(){
        this.slideChanged('next');
        // this.slides.slideNext(500,true);
    }

    slideChanged(str?){
        
        // let currentIndex = this.slides.getActiveIndex();
        let currentIndex = 0;
        let toLoadDate = new Date(this.calendarArr[currentIndex].date.getTime());
        this.curYYYY = toLoadDate.getFullYear();
        this.curMM = toLoadDate.getMonth()+1;
        if(str == 'next'){
            // this.loading.present();
            let date = new Date(toLoadDate.setMonth(toLoadDate.getMonth()+1));
            this.showCalendar(date);

        }else if(currentIndex == 0){
            // this.loading.present();
            let date = new Date(toLoadDate.setMonth(toLoadDate.getMonth()-1));
            this.showCalendar(date, true);
            // this.slides.slideNext(0,false);
        }

        
    }

    goWorkoutPage(date:Date){
        this.navCtrl.push(AboutPage, {date: date});
    }

}
