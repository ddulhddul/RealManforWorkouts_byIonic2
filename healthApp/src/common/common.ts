import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class Common{
    
    month= [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ]
    monthMin= [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    week= [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ]

    constructor(
        public toast: ToastController
    ){}
    
    yyyymmddToDate(yyyymmdd:string){
        let yyyy = Number(yyyymmdd.substr(0,4))
        let mm = Number(yyyymmdd.substr(4,2))
        let dd = Number(yyyymmdd.substr(6,4))
        return new Date(yyyy, mm-1, dd)
    }

    yyyymmddToMD(yyyymmdd:string){
        let mm = Number(yyyymmdd.substr(4,2))
        let dd = Number(yyyymmdd.substr(6,4))
        return this.monthMin[mm-1]+' '+dd
    }

    yyyymmdd(dateNum){
        let date = new Date(dateNum);
        let yyyy = date.getFullYear();
        let mm:any = date.getMonth()+1;
        let dd:any = date.getDate();
        return ''+yyyy+(mm<10?'0'+mm:mm)+(dd<10?'0'+dd:dd);
    }

    yyyymm(dateNum){
        let date = new Date(dateNum);
        let yyyy = date.getFullYear();
        let mm:any = date.getMonth()+1;
        
        return yyyy+(mm<10?'0'+mm:mm);
    }

    timeToDpTime(time:number){
        let hour = Math.floor(time/3600); time=time%3600
        let min = Math.floor(time/60); 
        let sec = time%60;

        let preHour = hour<10? '0':'';
        let preMin = min<10? ':0':':';
        let preSec = sec<10? ':0':':';
        
        return preHour+hour+preMin+min+preSec+sec;
    }

    presentToast(msg, position?, duration?) {
        //top, middle, bottom
        let toast = this.toast.create({
            message: msg,
            position: position || 'top',
            duration: duration || 3000
        });
        toast.present();
    }

    defaultImg(target){
        target.img = 'icon';
    }

    defaultWorkouts(){
        return [
            {
                workoutId: 'pushUp',
                name: 'Push Up',
                img: 'pushUp'
            },
            {
                workoutId: 'dumbel',
                name: 'Dumbel',
                img: 'dumbel'
            }
        ];
    }

    
    dropSql = {
        workoutHist : [
            `DROP TABLE WORKOUT_HIST`
        ],
        workout : [
            'DROP TABLE WORKOUT'
        ],
        workoutTemplate : [
            'DROP TABLE WORKOUT_TEMPLATE'
        ]
    }
    
    createSql = {
        workoutHist : [
            `CREATE TABLE IF NOT EXISTS WORKOUT_HIST(
                DATE_YMD TEXT NOT NULL,
                WORKOUT_ORDER NUMBER,
                WORKOUT_ID TEXT,
                WORKOUT_NAME TEXT,
                WORKOUT_TIME NUMBER,
                UNITS TEXT,
                GOAL NUMBER DEFAULT 0,
                DONE NUMBER,
                WEIGHT NUMBER,
                WEIGHT_UNIT TEXT,
                PRIMARY KEY(DATE_YMD, WORKOUT_ORDER)
            )`,
            `CREATE INDEX DATE_WORKOUT_IDX ON WORKOUT_HIST(DATE_YMD, WORKOUT_ID)`,
            `CREATE INDEX WORKOUT_IDX ON WORKOUT_HIST(WORKOUT_ID)`,
            `CREATE INDEX DATE_IDX ON WORKOUT_HIST(DATE_YMD)`
        ],
        workout : [
            `CREATE TABLE WORKOUT(
                WORKOUT_ID TEXT PRIMARY KEY NOT NULL,
                GRP TEXT,
                WORKOUT_NAME TEXT,
                UNITS TEXT,
                GOAL NUMBER DEFAULT 0,
                WEIGHT NUMBER,
                WEIGHT_UNIT TEXT,
                LAST_GOAL NUMBER,
                LAST_WEIGHT NUMBER,
                IMG TEXT
            )`
        ],
        workoutTemplate : [
            `CREATE TABLE WORKOUT_TEMPLATE(
                TEMPLATE_NO NUMBER NOT NULL,
                TEMPLATE_NAME TEXT NOT NULL,
                WORKOUT_ID TEXT,
                WORKOUT_NAME TEXT,
                UNITS TEXT,
                GOAL NUMBER DEFAULT 0,
                WEIGHT NUMBER,
                WEIGHT_UNIT TEXT,
                SELECTED TEXT
            )`,
            `CREATE INDEX TEMPLATE_NO_IDX ON WORKOUT_TEMPLATE(TEMPLATE_NO)`
        ]
    }

    insertSql = {
        workout : [
            `INSERT OR REPLACE INTO WORKOUT (WORKOUT_ID,GRP,WORKOUT_NAME,UNITS,GOAL,WEIGHT,WEIGHT_UNIT,LAST_GOAL,LAST_WEIGHT,IMG) VALUES
                ('pushUp','Body','Push Up','5,10,15',100,'','','','','pushUp');`,
            `INSERT OR REPLACE INTO WORKOUT (WORKOUT_ID,GRP,WORKOUT_NAME,UNITS,GOAL,WEIGHT,WEIGHT_UNIT,LAST_GOAL,LAST_WEIGHT,IMG) VALUES
                ('dumbel','Arm','Dumbbel','5,10,15',100,'7','kg','','','dumbbel')`,
            `INSERT OR REPLACE INTO WORKOUT (WORKOUT_ID,GRP,WORKOUT_NAME,UNITS,GOAL,WEIGHT,WEIGHT_UNIT,LAST_GOAL,LAST_WEIGHT,IMG) VALUES
                ('benchPress','Shoulder','Bench Press','5,10,15',100,'30','kg','','','benchPress')`,
            `INSERT OR REPLACE INTO WORKOUT (WORKOUT_ID,GRP,WORKOUT_NAME,UNITS,GOAL,WEIGHT,WEIGHT_UNIT,LAST_GOAL,LAST_WEIGHT,IMG) VALUES
                ('flyDumbbel','Shoulder','Fly Dumbbel','5,10,15',100,'30','kg','','','flyDumbbel')`,
            `INSERT OR REPLACE INTO WORKOUT (WORKOUT_ID,GRP,WORKOUT_NAME,UNITS,GOAL,WEIGHT,WEIGHT_UNIT,LAST_GOAL,LAST_WEIGHT,IMG) VALUES
                ('shoulderPressBarbell','Shoulder','Shoulder Press-Barbell','5,10,15',100,'30','kg','','','shoulderPressBarbell')`,
        ]
    }
    
    sqlStorageInit(){
        let sqlList = [];
        sqlList = sqlList.concat(this.createSql['workoutHist'])
                        .concat(this.createSql['workout'])
                        .concat(this.createSql['workoutTemplate'])
                        .concat(this.insertSql['workout'])
        return sqlList
    }
}
