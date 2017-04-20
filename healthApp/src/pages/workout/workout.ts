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

    constructor(
        public navCtrl: NavController,
        public sql: SqlStorage,
        public modalCtrl: ModalController
        ) {
    }

    ionViewWillEnter(){
        this.workouts = [];
        this.sql.query(`
            SELECT * FROM WORKOUT
        `).then((res)=>{
            if(res.res){
                let rows = res.res.rows;
                this.workouts = rows;
            }
        });
    }

    presentModal() {
        let modal = this.modalCtrl.create(WorkoutDetailPage);
        modal.present();
    }

}
