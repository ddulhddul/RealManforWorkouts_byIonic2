import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, Slides } from 'ionic-angular';
import * as Common from '../../common/common';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {

    @ViewChild(Slides) slides: Slides;
    calendarFirstDate:Date;
    calendarArr:any;

    constructor(
            public navCtrl: NavController,
            public storage: Storage) {
        this.defaultSet(new Date());
    }

    defaultSet(date:Date){
        this.calendarArr = [];       
        let date1 = new Date(),date2 = new Date(),date3 = new Date();
        date1 = new Date(date1.setMonth(date.getMonth()-1));
        this.calendarArr.push({
            calendar: this.showCalendar(date1),
            date: date1
        });

        date2 = new Date(date2.setMonth(date.getMonth()));
        this.calendarArr.push({
            calendar: this.showCalendar(date2),
            date: date2
        });

        date3 = new Date(date3.setMonth(date.getMonth()+1));
        this.calendarArr.push({
            calendar: this.showCalendar(date3),
            date: date3
        });

        this.loadWorkoutHist();
    }

    loadWorkoutHist(index?:number){
        this.storage.ready().then(() => {
            for (let i = (index===undefined?0:index); i < (index===undefined?this.calendarArr.length:index+1); i++) {
                for (let j = 0; j < this.calendarArr[i].calendar.length; j++) {
                    for (let k = 0; k < this.calendarArr[i].calendar[j].length; k++) {
                        this.getWorkout(this.calendarArr[i].calendar[j][k], i, j, k);
                    }
                    
                }
            }
        });
    }

    getWorkout(param, i, j, k){

        this.storage.get('workout'+Common.yyyymmdd(param.date.getTime())).then((val)=>{
            if(val){
                let obj = JSON.parse(val);
                obj.date = param.date;
                this.calendarArr[i].calendar[j][k] = obj;
            }
        });
    }

    showCalendar(date:Date, loadDate?:boolean){
        let targetDate = date || new Date();
        let calendar = [];
        let targetFirstDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        targetFirstDate.setDate(
            targetFirstDate.getDate() - targetFirstDate.getDay()-1
        );

        calendarLoop:
        while(true){
            let week:Array<any> = [];
            for (let i = 0; i < 7; i++) {
                targetFirstDate.setDate(
                    targetFirstDate.getDate() +1
                );
                let dateTime = targetFirstDate.getTime();
                let pushObj = {date:null};
                pushObj.date = new Date(dateTime);
                if(loadDate){
                    this.storage.get('workout'+Common.yyyymmdd(pushObj.date.getTime())).then((val)=>{
                        if(val){
                            let obj = JSON.parse(val);
                            obj.date = pushObj.date;
                            pushObj = obj;
                        }
                        week.push(pushObj);
                    });
                }else{
                    week.push(pushObj);
                }
            }
            calendar.push(week);
            if(targetFirstDate.getFullYear()+(targetFirstDate.getMonth()<10?'0':'')+targetFirstDate.getMonth()
                > targetDate.getFullYear()+(targetDate.getMonth()<10?'0':'')+targetDate.getMonth()){
                break calendarLoop;
            }
        }
        return calendar;
    }

    prev(){
        this.slides.slidePrev(500,true);
    }
    
    next(){
        this.slides.slideNext(500,true);
    }

    slideChanged(swiper:any){
        
        let currentIndex = this.slides.getActiveIndex();
        let toLoadDate = new Date(this.calendarArr[currentIndex].date.getTime());
        if(currentIndex == this.calendarArr.length-1){
            let date = new Date(toLoadDate.setMonth(toLoadDate.getMonth()+1));
            this.calendarArr.push({
                calendar: this.showCalendar(date, true),
                date: date
            });
            // this.loadWorkoutHist(this.calendarArr.length-1);

        }else if(currentIndex == 0){
            let date = new Date(toLoadDate.setMonth(toLoadDate.getMonth()-1));
            this.calendarArr.unshift({
                calendar: this.showCalendar(date, true),
                date: date
            });
            this.slides.slideNext(0,false);
            // this.loadWorkoutHist(0);
        }
    }

}
