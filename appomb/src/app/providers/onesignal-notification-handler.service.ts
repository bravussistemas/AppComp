import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Utils } from '../utils/utils';
import { Storage } from '@ionic/storage-angular';
import OneSignal from 'onesignal';
import { Router } from '@angular/router';

export interface OneSignalDataFromServer {
  action: string;
  page: number;
  params: string;
}

export enum OneSignalServerAction {
  OPEN_PAGE = 'open_page',
}

function serializeServePage(serverPage: number): string {
  switch (serverPage) {
    case 1:
      return 'AdmManageProductPage';
    default:
      return '';
  }
}

@Injectable({
  providedIn: 'root',
})
export class OneSignalNotificationHandlerService {
  private serverData: OneSignalDataFromServer | undefined;

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private router: Router 
  ) {
    this.initStorage();
    this.initOneSignal();
  }

  private async initStorage(): Promise<void> {
    await this.storage.create();
  }

  private initOneSignal(): void {
    OneSignal.init({
      appId: 'YOUR-ONESIGNAL-APP-ID',
      allowLocalhostAsSecureOrigin: true, // Necessário para testes locais
    });

    // Solicitar permissão do usuário
    OneSignal.showSlidedownPrompt();

    // Gerenciar notificações recebidas
    OneSignal.on('notificationDisplay', (event) => {
      console.log('Notification displayed:', event);
      this.handleNotification(event);
    });

    // Gerenciar notificações abertas
    OneSignal.on('notificationClick', (event) => {
      console.log('Notification clicked:', event);
      this.handleNotification(event.notification);
    });
  }

  private async openPage(): Promise<void> {
    const params = this.serverData?.params || {};
    const page = serializeServePage(this.serverData?.page || 0);
    await this.storage.set('GO_TO_AFTER_LOGIN', page);
  
    const currentUrl = this.router.url;
    if (currentUrl !== `/${page}`) {
      await this.navCtrl.navigateRoot(page, { state: params });
    }
  }

  private async handleNotification(notification: any): Promise<void> {
    const additionalData = notification.additionalData || {};
    const isServer = !!Utils.safeAttr(additionalData, 'from_server');
    console.debug('isServerNotification:', isServer);

    if (isServer) {
      this.serverData = additionalData as OneSignalDataFromServer;
      switch (this.serverData.action) {
        case OneSignalServerAction.OPEN_PAGE:
          await this.openPage();
          break;
        default:
          console.warn('Unhandled server action:', this.serverData.action);
      }
    }
  }
}
