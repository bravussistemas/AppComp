import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export interface MyToastOptions {
  message: string;
  duration?: number;
  cssClass?: string;
  position?: 'top' | 'bottom' | 'middle';
  autoHide?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastHelper {
  private toast: HTMLIonToastElement | null = null;

  constructor(private toastCtrl: ToastController, private trans: TranslateService) {}

  async show(options: MyToastOptions): Promise<void> {
    const duration = options.autoHide === false ? 0 : options.duration || 3000;

    if (!this.toast && options.message) {
      this.toast = await this.toastCtrl.create({
        message: options.message,
        duration,
        cssClass: options.cssClass || '',
        position: options.position || 'bottom',
      });
      await this.toast.present();

      // Limpa a referência após o timeout
      if (duration > 0) {
        setTimeout(() => {
          this.toast = null;
        }, duration + 100);
      }
    }
  }

  async dismiss(): Promise<void> {
    if (this.toast) {
      await this.toast.dismiss();
      this.toast = null;
    }
  }

  connectionError(): void {
    this.trans.get('CONNECTION_ERROR').subscribe(async (val) => {
      await this.show({ message: val, cssClass: 'toast-error' });
    });
  }
}
