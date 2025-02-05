import { AlertController, AlertOptions } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AlertHelper {

  private alert;

  constructor(private alertCtrl: AlertController, private trans: TranslateService) {
  }

  show(title?: string, message?: string) {
    if (!this.alert && (title || message)) {
      if (title && !message) {
        message = title;
        title = null;
      }
      this.alert = this.alertCtrl.create({
        header: title,
        subHeader: message,
        buttons: ['OK']
      });
      this.present();
    }
  }

  private present() {
    this.alert.present({
      keyboardClose: false
    }).then(() => this.alert = null);
  }

  confirm(title?: string, message?: string, positiveBtn?: string, negativeBtn?: string, cssClass?: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.alert && (title || message)) {
        this.trans.get(['YES', 'NO']).subscribe(
          (res) => {
            this.alert = this.alertCtrl.create({
              header: title,
              subHeader: message,
              cssClass: cssClass,
              buttons: [
                {
                  text: negativeBtn || res.NO,
                  handler: () => {
                    resolve(false);
                  }
                },
                {
                  text: positiveBtn || res.YES,
                  handler: () => {
                    resolve(true);
                  }
                },
              ]
            });
            this.present();
          }
        );
      }
    });
  }

  prompt(options: AlertOptions): Promise<{}> {
    return new Promise((resolve) => {
      if (!this.alert) {
        this.alert = this.alertCtrl.create({
          header: options.header,
          subHeader: options.subHeader,
          inputs: options.inputs,
          buttons: [
            {
              text: 'Cancelar',
              handler: data => {
              }
            },
            {
              text: 'Enviar',
              handler: data => {
                resolve(data);
              }
            }
          ]
        });
        this.present();
      }
    });
  }

  toast() {

  }
}