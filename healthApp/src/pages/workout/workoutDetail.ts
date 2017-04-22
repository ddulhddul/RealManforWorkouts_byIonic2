import { Component } from '@angular/core';
import { workoutForm } from './workoutForm'
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SqlStorage } from '../../common/sql';
import { Storage } from '@ionic/storage';
import * as Common from '../../common/common';

@Component({
  selector: 'page-workoutDetail',
  templateUrl: 'workoutDetail.html'
})
export class WorkoutDetailPage {
    model:workoutForm = new workoutForm();
    curNum:number;

    constructor(
        public navCtrl: NavController,
        public sql: SqlStorage,
        public storage: Storage,
        public params: NavParams,
        public viewCtrl: ViewController
        ) {

        let param = this.params.get('param');
        if(!param){
            this.storage.ready().then(() => {
                this.storage.get('customWorkoutNum').then((val) => {
                    this.curNum = 1;
                    if(val) this.curNum = val+1;
                    this.model = new workoutForm('customWorkout'+this.curNum);
                })
            });
        }else{
            let obj = JSON.parse(param);
            let units = obj.UNITS.split(',');
            this.model = new workoutForm(
                obj.WORKOUT_ID,
                obj.WORKOUT_NAME,
                obj.UNITS,
                obj.GOAL,
                obj.IMG,
                obj.WEIGHT,
                obj.WEIGHT_UNIT,
                obj.LAST_GOAL,
                obj.LAST_WEIGHT,
                units[0],
                units[1],
                units[2]
            );

        }
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    onSubmit(form:any){
        let curform = form;
        if(!curform.valid) return;
        let obj = this.model;
        let units = obj.unit1+','+obj.unit2+','+obj.unit3;
        let sql = `
            INSERT OR REPLACE INTO WORKOUT
            (
                WORKOUT_ID,
                WORKOUT_NAME,
                UNITS,
                GOAL,
                WEIGHT,
                WEIGHT_UNIT,
                IMG
            )
            VALUES
            (
                '${obj.id}',
                '${obj.name}',
                '${units}',
                '${obj.goal || ''}',
                '${obj.weight || ''}',
                '${obj.weightUnit || ''}',
                '${obj.id}'
            )`;
        
        this.sql.query(sql).then((res)=>{
            if(!this.params.get('param')){
                this.storage.ready().then(() => {
                    this.storage.set('customWorkoutNum', this.curNum);
                });
            }
            //toast
            //return to main
            this.dismiss();
            return;
        }, (err)=>{
            console.log('err : ',err);
            return;
        })
    }

}
