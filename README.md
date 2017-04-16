![icon](https://github.com/ddulhddul/HealthApp-byIonic2/blob/master/icon.png?raw=true)

# Health App(ing...)
```bash
ionic start healthApp --v2
cd healthApp
ionic serve

cordova platform add android
ionic build android --prod
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

## Storage
key | value
- | -
workoutYYYYMMDD:object | date, time, cumTime, dpTime, workouts(workoutId, name, done, goal, units, img)
workoutClass:Array | workoutId, name
templates:Array | workoutId, name, goal, units, weight, weightUnit
