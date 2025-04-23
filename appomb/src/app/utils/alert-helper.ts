import { AlertController, AlertOptions } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AlertHelper {
  private alert;

  constructor(
    private alertCtrl: AlertController,
    private trans: TranslateService
  ) {}

  async show(title?: string, message?: string) {
    if (!this.alert && (title || message)) {
      if (title && !message) {
        message = title;
        title = null;
      }

      this.alert = await this.alertCtrl.create({
        header: title,
        subHeader: message,
        buttons: ['OK'],
      });

      await this.present();
    }
  }

  private async present() {
    if (this.alert) {
      await this.alert.present();
      // this.alert = null;
    }
  }

  async confirm(
    title?: string,
    message?: string,
    positiveBtn?: string,
    negativeBtn?: string,
    cssClass?: string
  ): Promise<boolean> {
    if (!this.alert && (title || message)) {
      const res = await this.trans.get(['YES', 'NO']).toPromise();
  
      return new Promise(async (resolve) => {
        this.alert = await this.alertCtrl.create({
          header: title,
          subHeader: message,
          cssClass: cssClass,
          buttons: [
            {
              text: negativeBtn || res.NO,
              role: 'cancel', 
            },
            {
              text: positiveBtn || res.YES,
              role: 'confirm', 
            },
          ],
        });
  
        await this.present();
  
        this.alert.onDidDismiss().then((result) => {
          const wasConfirmed = result?.role === 'confirm';
          this.alert = null; 
          resolve(wasConfirmed);
        });
      });
    }
  
    return Promise.resolve(false);
  }
  

  async prompt(options: AlertOptions): Promise<any> {
    if (!this.alert) {
      this.alert = await this.alertCtrl.create({
        header: options.header,
        subHeader: options.subHeader,
        inputs: options.inputs,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Enviar',
            handler: (data) => {
              return data;
            },
          },
        ],
      });

      await this.present();
    }
  }

  toast() {}
}
