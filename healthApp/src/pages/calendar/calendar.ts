import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import * as Common from '../../common/common';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {

    calendarFirstDate:Date;
    calendar:Array<Array<any>>;
    curDate:Date;

    constructor(
            public navCtrl: NavController,
            public storage: Storage) {
        this.showCalendar(null);
    }

    showCalendar(date:Date){
        this.curDate = date || new Date();
        this.calendar = [];
        this.calendarFirstDate = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), 1);
        this.calendarFirstDate.setDate(
            this.calendarFirstDate.getDate() - this.calendarFirstDate.getDay()-1
        );

        this.storage.ready().then(() => {

            calendarLoop:
            while(true){
                let week:Array<any> = [];
                for (let i = 0; i < 7; i++) {
                    this.calendarFirstDate.setDate(
                        this.calendarFirstDate.getDate() +1
                    );
                    let dateTime = this.calendarFirstDate.getTime();
                    let yyyymmdd = Common.yyyymmdd(dateTime);
                    this.storage.get('workout'+yyyymmdd).then((val) => {
                        let pushObj = {date:null};
                        if(val) pushObj = JSON.parse(val);
                        pushObj.date = new Date(dateTime);
                        week.push(pushObj);
                    })
                }
                this.calendar.push(week);
                if(this.calendarFirstDate.getFullYear()+(this.calendarFirstDate.getMonth()<10?'0':'')+this.calendarFirstDate.getMonth()
                    > this.curDate.getFullYear()+(this.curDate.getMonth()<10?'0':'')+this.curDate.getMonth()){
                    break calendarLoop;
                }
            }
        });
    }

    prev(param:Date){
        param.setMonth(param.getMonth()-1);
        this.showCalendar(param);
    }
    
    next(param:Date){
        param.setMonth(param.getMonth()+1);
        this.showCalendar(param);
    }

}
