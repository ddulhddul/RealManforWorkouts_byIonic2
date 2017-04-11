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
    }

    showCalendar(date:Date){
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
                week.push(pushObj);
            }
            calendar.push(week);
            if(targetFirstDate.getFullYear()+(targetFirstDate.getMonth()<10?'0':'')+targetFirstDate.getMonth()
                > targetDate.getFullYear()+(targetDate.getMonth()<10?'0':'')+targetDate.getMonth()){
                break calendarLoop;
            }
        }
        return calendar;
    }

    prev(param:Date){
        this.slides.slidePrev(500,true);
    }
    
    next(param:Date){
        this.slides.slideNext(500,true);
    }

    slideChanged(swiper:any){
        
        let currentIndex = this.slides.getActiveIndex();
        let toLoadDate = new Date(this.calendarArr[currentIndex].date.getTime());
        if(currentIndex == this.calendarArr.length-1){
            let date = new Date(toLoadDate.setMonth(toLoadDate.getMonth()+1));
            this.calendarArr.push({
                calendar: this.showCalendar(date),
                date: date
            });

        }else if(currentIndex == 0){
            let date = new Date(toLoadDate.setMonth(toLoadDate.getMonth()-1));
            this.calendarArr.unshift({
                calendar: this.showCalendar(date),
                date: date
            });
            this.slides.slideNext(0,false);
        }
    }

}
