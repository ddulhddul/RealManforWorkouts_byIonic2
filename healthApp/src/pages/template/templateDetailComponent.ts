import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { workoutForm } from '../workout/workoutForm';
import { Common } from '../../common/common';

@Component({
  selector: 'page-templateDetailComponent',
  templateUrl: 'templateDetailComponent.html'
})
export class TemplateDetailComponent {
  @Input() workouts: Array<workoutForm>;
  @Input() isTemplate: boolean;
  @Input() editable: boolean;
  @Input() dpTime: string;
  pageWidth: number = 360;

  constructor(
    public navCtrl: NavController,
    public commonFunc: Common) {
      this.pageWidth = Math.min(document.body.offsetWidth, 400)-40
      console.log(this.pageWidth)
  }
  
  workoutClick(workout, unit){
    // if(!this.isStarted) this.start();
    unit = Number(unit) || 0;
    workout.done += unit;
    this.commonFunc.presentToast(unit<0? unit: '+'+unit, 'top', '1000');
    workout.message = this.dpTime;
  }

  deleteWorkout(index){
    this.workouts.splice(index,1);
  }

  itemUp(index){
    if(index == 0) return;
    let workouts = this.workouts;
    let temp = workouts[index-1];
    workouts[index-1] = workouts[index];
    workouts[index] = temp;
  }

  itemDown(index){
    let workouts = this.workouts;
    if(index == workouts.length-1) return;
    let temp = workouts[index];
    workouts[index] = workouts[index+1];
    workouts[index+1] = temp;
  }

  customTrackBy(index: number, obj: any): any {
    return  index;
  }
}
