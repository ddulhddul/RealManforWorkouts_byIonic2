import { Component, ViewChild } from '@angular/core';
import { Platform, App, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { ListPage } from '../pages/workoutlist/workoutlist';
import { CalendarPage } from '../pages/calendar/calendar';
import { OptionPage } from '../pages/option/option';
import { TestPage } from '../pages/test/test';
import { WorkoutPage } from '../pages/workout/workout';
import { TemplatePage } from '../pages/template/template';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav
  // rootPage:any = ListPage;
  rootPage:any = AboutPage;
  listPage:any = ListPage;
  homePage:any = HomePage;
  aboutPage:any = AboutPage;
  contactPage:any = ContactPage;
  calendarPage:any = CalendarPage;
  optionPage:any = OptionPage;
  testPage:any = TestPage;
  workoutPage:any = WorkoutPage;
  templatePage:any = TemplatePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              app: App, public menu: MenuController, storage: Storage) {
    menu.enable(true);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
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
