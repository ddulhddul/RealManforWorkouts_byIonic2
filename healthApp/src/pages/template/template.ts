import { Component } from '@angular/core';
import { SqlStorage } from '../../common/sql';
import { NavController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { TemplateDetailPage } from './templateDetail';
import { Common } from '../../common/common';

@Component({
  selector: 'page-template',
  templateUrl: 'template.html'
})
export class TemplatePage {
    isModal: boolean = false;
    templates: Array<any>;
    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public params: NavParams,
        public viewCtrl: ViewController,
        public commonFunc: Common,
        public sql: SqlStorage) {
        this.loadTemplates();
        this.isModal = !!this.params.get('isModal');
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
            if(data){
                this.commonFunc.presentToast('Saved', 'top', '');
                this.loadTemplates();
            } 
        });
    }

    detailPage(template:any){
        if(this.isModal){
            this.dismiss(template);
            return;
        }

        this.presentModal({
            templateNo : template.TEMPLATE_NO,
            templateName : template.TEMPLATE_NAME
        })
    }

    deleteTemplate(template){
        this.sql.query(
            `DELETE FROM WORKOUT_TEMPLATE
                WHERE TEMPLATE_NO = ${template.TEMPLATE_NO}`
        ).then((res)=>{
            this.commonFunc.presentToast('Deleted.', 'top', '');
            this.loadTemplates();
        }).catch((err)=>{
            console.log('db error...',err)   
        })
    }

    dismiss(param?){
        this.viewCtrl.dismiss(param);
    }
}
