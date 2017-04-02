import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  time: number;
  dpTime: string;
  cumTime: number;
  subscription: Subscription;

  constructor(public navCtrl: NavController) {
    this.setDefault();
  }

  setDefault(){
    this.time = 0;
    this.cumTime = 0;
    this.dpTime = '00:00:00';
  }
  start(){
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
}
