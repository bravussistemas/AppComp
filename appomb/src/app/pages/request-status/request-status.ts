import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Sales } from '../../shared/models/sales.model';
import { DeliveryMethod } from '../../shared/interfaces';
import { AppConfig } from '../../../configs';

@Component({
  selector: 'page-request-status',
  templateUrl: './request-status.html',
  styleUrl: './request-status.scss',
})
export class RequestStatusPage {

  sale: Sales;
  deliveryMethods = DeliveryMethod;

  constructor(
    private modalCtrl: ModalController,
    private appConfig: AppConfig,
    private route: ActivatedRoute
  ) {
    // Recupera dados da rota, caso necessário
    this.route.queryParams.subscribe(params => {
      this.sale = params['sale'] ? JSON.parse(params['sale']) : null;
    });
  }

  showPickupRules() {
    return this.appConfig.SHOW_PICKUP_RULES;
  }

  saleHasMoneyChange() {
    return false; // Atualize aqui, conforme sua lógica
  }

  parseFirstName(name: string): string {
    const result = name?.split(' ');
    return result?.length ? result[0] : '';
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
