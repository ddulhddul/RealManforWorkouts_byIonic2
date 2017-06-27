import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ListPage } from '../pages/workoutlist/workoutlist';
import { CalendarPage } from '../pages/calendar/calendar';
import { OptionPage } from '../pages/option/option';
import { WorkoutPage } from '../pages/workout/workout';
import { SearchPipe } from '../pages/workout/searchPipe';
import { WorkoutDetailPage } from '../pages/workout/workoutDetail';
import { GraphPage } from '../pages/graph/graph';
import { TemplatePage } from '../pages/template/template';
import { TemplateDetailPage } from '../pages/template/templateDetail';
import { TemplateDetailComponent } from '../pages/template/templateDetailComponent';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AdMob } from '@ionic-native/admob';
import { IonicStorageModule } from '@ionic/storage';
import { SqlStorage } from '../common/sql';
import { FormsModule }   from '@angular/forms';
import { ChartModule } from 'angular2-chartjs';
import { Common } from '../common/common';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { AppVersion } from '@ionic-native/app-version';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ListPage,
    CalendarPage,
    OptionPage,
    WorkoutPage,
    SearchPipe,
    WorkoutDetailPage,
    TemplateDetailPage,
    TemplatePage,
    TemplateDetailComponent,
    GraphPage
  ],
  imports: [
    FormsModule,
    ChartModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ListPage,
    CalendarPage,
    OptionPage,
    WorkoutPage,
    WorkoutDetailPage,
    TemplateDetailPage,
    TemplatePage,
    TemplateDetailComponent,
    GraphPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AdMob,
    SqlStorage,
    Common,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppVersion
  ]
})
export class AppModule {}
