import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, NavParams } from 'ionic-angular';
import { templateForm } from './templateForm';
import { WorkoutPage } from '../workout/workout';
import { workoutForm } from '../workout/workoutForm';
import { SqlStorage } from '../../common/sql';

@Component({
  selector: 'page-templateDetail',
  templateUrl: 'templateDetail.html'
})
export class TemplateDetailPage {

    model: templateForm = new templateForm();
    workouts: Array<workoutForm> = [];

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public params: NavParams,
        public sql: SqlStorage,
        public viewCtrl: ViewController) {
        let param = this.params.get('param');
        if(param){
            param = JSON.parse(param);
            this.model = new templateForm(param.templateNo, param.templateName);
            this.sql.query(`
                SELECT T.*, W.IMG
                FROM WORKOUT_TEMPLATE T
                LEFT OUTER JOIN WORKOUT W
                ON T.WORKOUT_ID = W.WORKOUT_ID
                WHERE T.TEMPLATE_NO = '${param.templateNo}'
            `).then((res)=>{
                for (let i = 0; i < res.res.rows.length; i++) {
                    let element = res.res.rows[i];
                    let units = element.UNITS.split(',');
                    this.workouts.push(new workoutForm(
                        element.WORKOUT_ID,
                        element.WORKOUT_NAME,
                        units,
                        element.GOAL,
                        element.IMG,
                        units[0],
                        units[1],
                        units[2],
                        element.WEIGHT,
                        element.WEIGHT_UNIT,
                        element.LAST_GOAL,
                        element.LAST_WEIGHT
                    ))
                }
            }).catch((err)=>{
                console.log('err', err)

            })
        }
    }

    dismiss(param?){
        this.viewCtrl.dismiss(param);
    }

    insertTemplate(i:number, templateNo:number){
        if(i >= this.workouts.length){
            this.dismiss('submit');
            return;
        }
        let workout = this.workouts[i];
        
        this.sql.query(`
            INSERT INTO WORKOUT_TEMPLATE
            (
                TEMPLATE_NO,
                TEMPLATE_NAME,
                WORKOUT_ID,
                WORKOUT_NAME,
                UNITS,
                GOAL,
                WEIGHT,
                WEIGHT_UNIT,
                SELECTED
            )
            VALUES
            (
                '${templateNo}',
                '${this.model.name}',
                '${workout.id}',
                '${workout.name}',
                '${workout.units.join(',')}',
                '${workout.goal}',
                '${workout.weight || ''}',
                '${workout.weightUnit || ''}',
                ''
            )
        `).then((res)=>{
            this.insertTemplate(++i, templateNo);
        }).catch((err)=>{
            console.log('insert error....', err);
        });

    }
    onSubmit(form:any){
        let curform = form;
        if(!curform.valid) return;

        if(this.model.no){
            this.sql.query(`DELETE FROM WORKOUT_TEMPLATE WHERE TEMPLATE_NO = '${this.model.no}'`).then((res)=>{
                this.insertTemplate(0, this.model.no);
            }).catch((err)=>{
                console.log('err',err);
            })
        }else{
            this.sql.query('SELECT IFNULL((SELECT MAX(TEMPLATE_NO) FROM WORKOUT_TEMPLATE), 0)+1 NUM')
            .then((res)=>{
                console.log('succ', res.res.rows[0]['NUM'])
                this.insertTemplate(0, res.res.rows[0]['NUM']);
            }).catch((err)=>{
                console.log('err', err)
            })
        }
    }

    presentModal(val) {
        let params = {param:undefined};
        if(val) params.param = JSON.stringify(val);

        let modal = this.modalCtrl.create(
            WorkoutPage, params
        );
        modal.present();
        modal.onDidDismiss((data) => {
            if(data){
                let units = data.UNITS.split(',');
                this.workouts.push(new workoutForm(
                    data.WORKOUT_ID, 
                    data.WORKOUT_NAME,
                    [units[0], units[1], units[2]],
                    data.GOAL,
                    data.IMG,
                    units[0],
                    units[1],
                    units[2],
                    data.WEIGHT,
                    data.WEIGHT_UNIT,
                    data.LAST_GOAL,
                    data.LAST_WEIGHT
                ));
            }
        });
    }
}
