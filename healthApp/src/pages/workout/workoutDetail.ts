import { Component } from '@angular/core';
import { workoutForm } from './workoutForm'
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SqlStorage } from '../../common/sql';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-workoutDetail',
  templateUrl: 'workoutDetail.html'
})
export class WorkoutDetailPage {
    model:workoutForm = new workoutForm('customWorkout1','a',[],0,'a');
    message:string;

    constructor(
        public navCtrl: NavController,
        public sql: SqlStorage,
        public storage: Storage,
        public params: NavParams,
        public viewCtrl: ViewController
        ) {
        
        // if(!this.params){
            this.storage.ready().then(() => {
                this.storage.get('customWorkoutNum').then((val) => {
                    let curNum = 1;
                    if(val) curNum = val+1;
                    this.model = new workoutForm('customWorkout'+curNum,'a',[],0,'a');
                })
            });
        // }
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    onSubmit(form:any){
        let curform = form;
        if(!curform.valid) return;
        this.message = 'submitted...';
    }

}
