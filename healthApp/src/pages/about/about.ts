import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  isStarted: boolean;
  time: number;
  dpTime: string;
  cumTime: number;
  subscription: Subscription;
  workouts: Array<any>;

  constructor(public navCtrl: NavController) {
    this.setDefault();
  }

  setDefault(){
    this.time = 0;
    this.cumTime = 0;
    this.dpTime = '00:00:00';
    this.isStarted = false;
    this.workouts = [
      {
        name: 'push-ups',
        id: 'pushUp',
        done: 0,
        goal: 100,
        units: [5,10,15]
      },
      {
        name: 'dumbel Right',
        id: 'dumbelRight',
        done: 0,
        goal: 100,
        units: [5,10,15],
        weight: 7,
        weightUnit: 'kg'
      }
    ]
  }
  start(){
    if(this.isStarted) return;
    this.isStarted = true;
    let timer = Observable.timer(0, 1000);
    this.subscription = timer.subscribe(t => {
      this.time = this.cumTime + t;
      let time = this.time;
      let hour = Math.floor(time/3600); time=time%3600
      let min = Math.floor(time/60); 
      let sec = time%60;

      let preHour = '';
      let preMin = ':';
      let preSec = ':';
      if(hour<10) preHour = '0';
      if(min<10) preMin = ':0';
      if(sec<10) preSec = ':0';
      
      this.dpTime = preHour+hour+preMin+min+preSec+sec;
    });
  }
  stop(){
    this.isStarted = false;
    this.cumTime = this.time;
    !this.subscription || this.subscription.unsubscribe();
  }
  reset(){
    this.setDefault();
    !this.subscription || this.subscription.unsubscribe();
  }
  ngOnDestroy(){
    this.reset();
  }

  workoutClick(workout, unit){
    workout.done += unit;
  }
}
