import { Component, ViewChild } from '@angular/core';
import { Platform, App, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { ListPage } from '../pages/workoutlist/workoutlist';
import { CalendarPage } from '../pages/calendar/calendar';
import { OptionPage } from '../pages/option/option';
import { WorkoutPage } from '../pages/workout/workout';
import { TemplatePage } from '../pages/template/template';
import { GraphPage } from '../pages/graph/graph';
import { Common } from '../common/common';
// import { AdMob } from 'ionic-native';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav
  rootPage:any = ListPage;
  listPage:any = ListPage;
  homePage:any = HomePage;
  aboutPage:any = AboutPage;
  contactPage:any = ContactPage;
  calendarPage:any = CalendarPage;
  optionPage:any = OptionPage;
  workoutPage:any = WorkoutPage;
  templatePage:any = TemplatePage;
  graphPage:any = GraphPage;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public alert: AlertController, public commonFunc: Common,
              app: App, public menu: MenuController, storage: Storage) {
    
    menu.enable(true);
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // let options:AdMobOptions={
      //   adId: 'ca-app-pub-6335521540809347/4656000517',
      //   adSize: 'SMART_BANNER',
      //   isTesting: false
      // }
      // this.admob.createBanner(options).then(()=>{
      //     this.admob.showBanner(8)
      // })

      // if(AdMob) AdMob.createBanner({
      //           adId: 'ca-app-pub-6335521540809347/4656000517',
      //           position: AdMob.AD_POSITION.TOP_CENTER,
      //           isTesting: true,
      //           autoShow: true })
      //           .then(()=>{
      //             AdMob.showBanner(8)
      //           });
      
    });
    // this.platform.registerBackButtonAction(this.exit)
  }

  exit(){
      // this.commonFunc.presentToast('are you sure to exit?', 'bottom')
      let alert = this.alert.create({
        title: 'Confirm',
        message: 'Do you want to exit?',
        buttons: [{
          text: "exit?",
          handler: () => { this.platform.exitApp() }
        }, {
          text: "Cancel",
          role: 'cancel'
        }]
      })
      alert.present();
  }

  openPage(page){
    if(this.nav.canGoBack()){
      this.nav.pop()
    }
    this.rootPage=page;
    this.menu.close();
  }
  
  openPopPage(page){
    this.nav.push(page);
    this.menu.close();
  }
}
