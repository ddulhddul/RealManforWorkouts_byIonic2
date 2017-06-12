import { Component } from '@angular/core';
import { SqlStorage } from '../../common/sql';
import { NavController } from 'ionic-angular';
import { Common } from '../../common/common';

@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html'
})
export class GraphPage {

    workout: string = '';
    allWorkouts: Array<Object> = [];
    isExistWeight: boolean = false;
    graphArr:Array<any> = [];
    isSrching:boolean = false; // prevent srch twice

    chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(231,233,237)'
    };

    constructor(
        public sql: SqlStorage,
        public commonFunc: Common,
        public navCtrl: NavController) {
        this.initWorkoutList()
    }

    initWorkoutList(){
        this.sql.query(`
            SELECT DISTINCT WORKOUT_ID, WORKOUT_NAME
            FROM WORKOUT_HIST
            ORDER BY WORKOUT_NAME
        `).then((res)=>{
            let rows = res.res.rows;
            for (let i = 0; i < rows.length; i++) {
                let element = rows[i];
                this.allWorkouts.push({
                    id : element.WORKOUT_ID,
                    name : element.WORKOUT_NAME
                })
            }
        }).catch((err)=>console.log('init workoutlist err',err))
    }

    srchGraph(val:any){
        if(this.isSrching) return;
        else this.isSrching = true;
        console.log('srchGraph in')
        this.sql.query(`
            SELECT 
                H.DATE_YMD,
                H.DONE,
                H.GOAL,
                H.WEIGHT,
                H.WEIGHT_UNIT
            FROM WORKOUT_HIST H
            WHERE WORKOUT_ID = '${val}'
            ORDER BY H.DATE_YMD, H.DONE DESC
        `).then((res)=>{
            this.graphArr = [];
            let rows = res.res.rows;
            this.isExistWeight = false;

            let labels = [], done = [], goal=[], dateArr=[];
            let tempDone = 0, doneDate = '';
            
            for (let i = 0, len = rows.length; i < len; i++) {
                let element = rows[i];
                let curDate = this.commonFunc.yyyymmddToMD(element.DATE_YMD);
                if(tempDone != element.DONE || i == len-1 || i == 0){
                    if(doneDate != curDate){
                        labels.push(curDate);
                        dateArr.push(this.commonFunc.yyyymmddToDate(element.DATE_YMD))
                        done.push(element.DONE);
                        goal.push(element.GOAL);
                        tempDone = element.DONE;
                        doneDate = curDate;
                    }
                }
                if(element.WEIGHT && element.WEIGHT_UNIT) this.isExistWeight = true;
            }
            console.log('push Graph load')
            this.graphArr.push({
                type : 'line',
                data : {labels: dateArr,
                    datasets: [{label: "Done",data: done,
                                borderColor: 'rgb(75, 192, 192)',
                                backgroundColor: 'rgba(75, 192, 192, 0.1)'},
                                {label: "Goal",data: goal,
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.1)'
                            }]
                },
                options : {
                    tooltips: {
                        callbacks: {
                            title: function(tooltipItem, data) {
                                let date = tooltipItem[0].xLabel;
                                let yyyy = date.getFullYear();
                                let mm:any = date.getMonth()+1;
                                let dd:any = date.getDate();
                                let split = '/'
                                return ''+yyyy+split+(mm<10?'0'+mm:mm)+split+(dd<10?'0'+dd:dd);
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'day',
                                unitStepSize: 1,
                                displayFormats: {
                                    'day': 'MMM DD',
                                }

                            }
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                // beginAtZero: true   // minimum value will be 0.
                            }
                        }]
                    }
                }
            })
            if(this.isExistWeight) this.srchGraphWeight(val);
            else this.isSrching = false;

        }).catch((err)=>console.log('srchGraph err',err))
    }

    srchGraphWeight(val){
        this.sql.query(`
            SELECT 
                H.DATE_YMD,
                H.WEIGHT,
                H.WEIGHT_UNIT
            FROM WORKOUT_HIST H
            WHERE WORKOUT_ID = '${val}'
            ORDER BY H.DATE_YMD, H.WEIGHT DESC
        `).then((res)=>{

            let labels2 = [], weight = [], dateArr2 = [];
            let tempWeight = 0, weightDate = '';
            let rows = res.res.rows;

            for (let i = 0, len = rows.length; i < len; i++) {
                let element = rows[i];
                let curDate = this.commonFunc.yyyymmddToMD(element.DATE_YMD);
                if(tempWeight != element.WEIGHT || i == len-1 || i == 0){
                    if(weightDate != curDate){
                        labels2.push(curDate);
                        dateArr2.push(this.commonFunc.yyyymmddToDate(element.DATE_YMD))
                        weight.push(element.WEIGHT);
                        tempWeight = element.WEIGHT;
                        weightDate = curDate;
                    }
                }
            }
            this.graphArr.push({
                type : 'line',
                data : {labels: dateArr2,
                datasets: [{label: "Weight",data: weight,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.1)'
                            }]
                },
                options : {
                    tooltips: {
                        callbacks: {
                            title: function(tooltipItem, data) {
                                let date = tooltipItem[0].xLabel;
                                let yyyy = date.getFullYear();
                                let mm:any = date.getMonth()+1;
                                let dd:any = date.getDate();
                                let split = '/'
                                return ''+yyyy+split+(mm<10?'0'+mm:mm)+split+(dd<10?'0'+dd:dd);
                            },
                            // label: function(tooltipItem, data) {
                            //     return data.datasets[0].label+':'+tooltipItem.yLabel;
                            // }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'day',
                                unitStepSize: 1,
                                displayFormats: {
                                    'day': 'MMM DD',
                                }

                            }
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                // beginAtZero: true   // minimum value will be 0.
                            }
                        }]
                    }
                }
            })
            this.isSrching = false;
            
        }).catch((err)=>console.log('srchGraphWeight err',err))
    }

}
