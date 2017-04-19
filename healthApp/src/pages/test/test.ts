import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { SqlStorage } from '../../common/sql';

@Component({
  selector: 'page-test',
  templateUrl: 'test.html'
})
export class TestPage {
  
  message:string;
  key:string;
  value:string;
  storage:SqlStorage;
  list:Array<any>;
  
  constructor(
      public navCtrl: NavController) {
    
    this.message = 'constructor...';
    this.storage = new SqlStorage();

    this.search();

  }

  search(){
    console.log('search.')
    this.message = 'hhh';
    this.list = [];
    this.storage.query('select key, value from kv').then((data)=>{
        // return data.res.rows.item(0).value;
        for(let i = 0; i < data.res.rows.length ; i ++){
            this.list.push({
                key: data.res.rows.item(i).key,
                value: data.res.rows.item(i).value
            });
        }
    }, (err)=>{
        this.message = 'error....'+err;
    })
  }

  set(){
    console.log('set....');
    this.storage.set(this.key, this.value);
    console.log('set.... End');
    this.search();
  }

}
