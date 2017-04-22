import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { WorkoutDetailPage } from './workoutDetail';
import { SqlStorage } from '../../common/sql';

@Component({
  selector: 'page-workout',
  templateUrl: 'workout.html'
})
export class WorkoutPage {
    workouts: Array<any>;
    originWorkouts: Array<any>;
    searchVal: string;

    constructor(
        public navCtrl: NavController,
        public sql: SqlStorage,
        public modalCtrl: ModalController
        ) {
    }

    ionViewWillEnter(){
        this.workouts = [];
        this.originWorkouts = [];
        this.sql.query(`
            SELECT * FROM WORKOUT ORDER BY WORKOUT_NAME
        `).then((res)=>{
            if(res.res){
                let rows = res.res.rows;
                for (let i = 0; i < rows.length; i++) {
                    this.workouts.push(rows[i]);
                    this.originWorkouts.push(rows[i]);       
                }
            }
        });
    }

    presentModal(val) {
        let params = {param:''};
        if(val) params.param = JSON.stringify(val);

        console.log('pre param : ',params)
        let modal = this.modalCtrl.create(
            WorkoutDetailPage, params
        );
        modal.present();
        modal.onDidDismiss((data) => {
            this.ionViewWillEnter();
        });
    }

    powerFilter(){
        this.workouts = this.originWorkouts.filter((val:any)=>{
            return val.WORKOUT_NAME.toUpperCase().indexOf(this.searchVal.toUpperCase()) != -1;
        });
    }

    deleteItem(workout:any){
        console.log('value... : ',workout);
        this.sql.query(`
            DELETE FROM WORKOUT WHERE WORKOUT_ID = '${workout.WORKOUT_ID}'
        `).then((res)=>{
            this.ionViewWillEnter();
        });
    }

}
