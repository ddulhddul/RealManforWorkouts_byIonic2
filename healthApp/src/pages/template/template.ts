import { Component } from '@angular/core';
import { SqlStorage } from '../../common/sql';
import { NavController, ModalController } from 'ionic-angular';
import { TemplateDetailPage } from './templateDetail';

@Component({
  selector: 'page-template',
  templateUrl: 'template.html'
})
export class TemplatePage {

    templates: Array<any>;
    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public sql: SqlStorage) {
        this.loadTemplates();
    }

    loadTemplates(){
        this.templates = [];
        this.sql.query(
            `SELECT
                T.TEMPLATE_NO,
                T.TEMPLATE_NAME,
                GROUP_CONCAT(
                    IFNULL(W.WORKOUT_NAME, T.WORKOUT_NAME), ', '
                ) WORKOUT_NAME_CONCAT
            FROM WORKOUT_TEMPLATE T
            LEFT OUTER JOIN WORKOUT W
            ON T.WORKOUT_ID = W.WORKOUT_ID
            GROUP BY T.TEMPLATE_NO`
        ).then((res)=>{
            if(res.res){
                let rows = res.res.rows;
                for (let i = 0; i < rows.length; i++) {
                    this.templates.push(rows[i]);
                }
            }
        }).catch((err)=>{
            console.log('db error...',err)   
        })
    }

    presentModal(val) {
        let params = {param:undefined};
        if(val) params.param = JSON.stringify(val);

        let modal = this.modalCtrl.create(
            TemplateDetailPage, params
        );
        modal.present();
        modal.onDidDismiss((data) => {
            if(data) this.loadTemplates();
        });
    }
}
