import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ModalController } from 'ionic-angular';
import { WorkoutDetailPage } from './workoutDetail';
import { SqlStorage } from '../../common/sql';
import { Common } from '../../common/common';

@Component({
  selector: 'page-workout',
  templateUrl: 'workout.html'
})
export class WorkoutPage {
    workouts: Array<any>;
    searchVal: string;
    addFlag: boolean = false;

    constructor(
        public navCtrl: NavController,
        public sql: SqlStorage,
        public commonFunc: Common,
        public params: NavParams,
        public viewCtrl: ViewController,
        public modalCtrl: ModalController
        ) {
        let param = this.params.get('param');
        if(param) this.addFlag = true;
    }

    ionViewWillEnter(){
        this.workouts = [];
        this.sql.query(`
            SELECT * FROM WORKOUT ORDER BY WORKOUT_NAME
        `).then((res)=>{
            if(res.res){
                let rows = res.res.rows;
                for (let i = 0; i < rows.length; i++) {
                    this.workouts.push(rows[i]);
                }
            }
        });
    }

    dismiss(param?){
        this.viewCtrl.dismiss(param);
    }

    presentModal(val) {
        if(this.addFlag){
            this.dismiss(val);
            return;
        }

        let params = {param:''};
        if(val) params.param = JSON.stringify(val);

        let modal = this.modalCtrl.create(
            WorkoutDetailPage, params
        );
        modal.present();
        modal.onDidDismiss((data) => {
            if(data) this.ionViewWillEnter();
        });
    }

    deleteItem(workout:any){
        this.sql.query(`
            DELETE FROM WORKOUT WHERE WORKOUT_ID = '${workout.WORKOUT_ID}'
        `).then((res)=>{
            this.commonFunc.presentToast('Deleted.')
            this.ionViewWillEnter();
        });
    }

}
