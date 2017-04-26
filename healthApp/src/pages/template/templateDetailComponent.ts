import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { workoutForm } from '../workout/workoutForm';

@Component({
  selector: 'page-templateDetailComponent',
  templateUrl: 'templateDetailComponent.html'
})
export class TemplateDetailComponent {
  @Input() workouts: Array<workoutForm>;
  @Input() isTemplate: boolean;
  @Input() editable: boolean;

  constructor(public navCtrl: NavController) {
  }

  editDone(){
    if(document.getElementsByClassName('ng-invalid').length == 0) this.editable=false;
  }
}
