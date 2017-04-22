import { Injectable } from '@angular/core';

@Injectable()
export class Common{
    yyyymmdd(dateNum){
        let date = new Date(dateNum);
        let yyyy = date.getFullYear();
        let mm:any = date.getMonth()+1;
        let dd:any = date.getDate();
        
        return yyyy+(mm<10?'0'+mm:mm)+(dd<10?'0'+dd:dd);
    }

    yyyymm(dateNum){
        let date = new Date(dateNum);
        let yyyy = date.getFullYear();
        let mm:any = date.getMonth()+1;
        
        return yyyy+(mm<10?'0'+mm:mm);
    }

    presentToast(toastCtrl, msg, position, duration) {
        //top, middle, bottom
        let toast = toastCtrl.create({
            message: msg,
            position: position,
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

    sqlStorageInit(){
        return [
        `CREATE TABLE IF NOT EXISTS WORKOUT_HIST(
            DATE_YMD TEXT NOT NULL,
            WORKOUT_ORDER NUMBER,
            WORKOUT_ID TEXT,
            WORKOUT_NAME TEXT,
            WORKOUT_TIME TEXT,
            GOAL NUMBER DEFAULT 0,
            DONE NUMBER,
            WEIGHT NUMBER,
            WEIGHT_UNIT TEXT,
            PRIMARY KEY(DATE_YMD, WORKOUT_ORDER)
        )`,
        `INSERT INTO WORKOUT
            (
                WORKOUT_ID,
                WORKOUT_NAME,
                UNITS,
                GOAL,
                WEIGHT,
                WEIGHT_UNIT,
                LAST_GOAL,
                LAST_WEIGHT,
                IMG
            )
            VALUES
            (
                'pushUp',
                'Push Up',
                '5,10,15',
                100,
                '',
                '',
                '',
                '',
                'pushUp'
            );
        `,
            `INSERT INTO WORKOUT
            (
                WORKOUT_ID,
                WORKOUT_NAME,
                UNITS,
                GOAL,
                WEIGHT,
                WEIGHT_UNIT,
                LAST_GOAL,
                LAST_WEIGHT,
                IMG
            )
            VALUES
            (
                'dumbel',
                'Dumbel',
                '5,10,15',
                100,
                '7',
                'kg',
                '',
                '',
                'dumbel'
            )`,
        `CREATE INDEX DATE_WORKOUT_IDX ON WORKOUT_HIST(DATE_YMD, WORKOUT_ID)`,
        `CREATE INDEX WORKOUT_IDX ON WORKOUT_HIST(WORKOUT_ID)`,
        `CREATE INDEX DATE_IDX ON WORKOUT_HIST(DATE_YMD)`,
        `CREATE TABLE WORKOUT(
            WORKOUT_ID TEXT PRIMARY KEY NOT NULL,
            WORKOUT_NAME TEXT,
            UNITS TEXT,
            GOAL NUMBER DEFAULT 0,
            WEIGHT NUMBER,
            WEIGHT_UNIT TEXT,
            LAST_GOAL NUMBER,
            LAST_WEIGHT NUMBER,
            IMG TEXT
        )`,
        `CREATE TABLE WORKOUT_TEMPLATE(
            TEMPLATE_NO NUMBER PRIMARY KEY NOT NULL,
            TEMPLATE_NAME TEXT NOT NULL,
            WORKOUT_ID TEXT,
            UNITS TEXT,
            GOAL NUMBER DEFAULT 0,
            WEIGHT NUMBER,
            WEIGHT_UNIT TEXT,
            SELECTED TEXT
        )`,
        `CREATE INDEX TEMPLATE_NO_IDX ON WORKOUT_TEMPLATE(TEMPLATE_NO)`,
        ];
    }
}
