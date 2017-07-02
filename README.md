![icon](https://github.com/ddulhddul/HealthApp-byIonic2/blob/master/icon.png?raw=true)
# Android App Store URL : [Click](https://play.google.com/store/apps/details?id=com.ionicframework.healthapp253624)


# Health App
```bash
ionic start healthApp --v2
cd healthApp
ionic serve

cordova platform add android
ionic build android --prod
ionic run android --device --prod
ionic cordova build android --prod
```

## stopwatch
[http://stackoverflow.com/questions/35813310/how-to-create-timer-in-angular2](http://stackoverflow.com/questions/35813310/how-to-create-timer-in-angular2)

## storage
```bash
cordova plugin add cordova-sqlite-storage --save
npm install --save @ionic/storage
ionic plugin add cordova-sqlite-storage
```

## type
    primary
    secondary
    danger
    light
    dark
    
## [Sqlite](http://www.tutorialspoint.com/sqlite)
[sql querys](https://github.com/ddulhddul/HealthApp-byIonic2/blob/master/SQL.md)

## Color
Color Combos

## [chartjs](https://www.npmjs.com/package/angular2-chartjs)
```linux
npm install angular2-chartjs
```

## ionic update(current 3.1.1)[https://github.com/driftyco/ionic/blob/master/CHANGELOG.md](https://github.com/driftyco/ionic/blob/master/CHANGELOG.md)

## ionic splash image & app icon
- resources\icon.png
- resources\splash.png
> ionic cordova resources

## addmob
```linux
ionic cordova plugin add cordova-plugin-admobpro
npm install --save @ionic/app-scripts@^1.3.7
npm install --save @ionic-native/core@^3.6.0

npm install --save @ionic-native/admob
npm install -g ionic@latest



```


## publishing android app
[http://ionicframework.com/docs/v1/guide/publishing.html](http://ionicframework.com/docs/v1/guide/publishing.html)

```linux
<!--gen Key-->
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name

zipalign -v 4 android-release-unsigned.apk Release.apk

```

## build ionic app options
[https://ionicframework.com/docs/cli/cordova/build/](https://ionicframework.com/docs/cli/cordova/build/)

ionic cordova build android --aot --minifyjs --minifycss --optimizejs --prod --release

## Camera plugin
```linux
ionic cordova plugin add cordova-plugin-camera
npm install --save @ionic-native/camera
```

## get app version
```linux
ionic cordova plugin add cordova-plugin-app-version
npm install --save @ionic-native/app-version
```