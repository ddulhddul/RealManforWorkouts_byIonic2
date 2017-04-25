import { Component } from '@angular/core';
import { NavController, ViewController, ModalController } from 'ionic-angular';
import { templateForm } from './templateForm';
import { WorkoutPage } from '../workout/workout';
import { workoutForm } from '../workout/workoutForm';

@Component({
  selector: 'page-templateDetail',
  templateUrl: 'templateDetail.html'
})
export class TemplateDetailPage {

    model: templateForm = new templateForm();
    workouts: Array<workoutForm> = [];

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public viewCtrl: ViewController) {
    }

    dismiss(param?){
        this.viewCtrl.dismiss(param);
    }

    onSubmit(form:any){
        let curform = form;
        if(!curform.valid) return;
    }

    presentModal(val) {
        let params = {param:undefined};
        if(val) params.param = JSON.stringify(val);

        let modal = this.modalCtrl.create(
            WorkoutPage, params
        );
        modal.present();
        modal.onDidDismiss((data) => {
            if(data){
                this.workouts.push(data);
                console.log('return data...',data);
                console.log('return data...',this.workouts);
                // if(data) this.loadTemplates();
            }
        });
    }
}
