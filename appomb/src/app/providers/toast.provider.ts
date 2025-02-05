import { ToastController } from '@ionic/angular';
export class ToastService {
  constructor(private toastCtrl: ToastController) {

  }

  async show(message: string) {
    if (!message) {
      return;
    }
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    (await toast).present();
  }
}