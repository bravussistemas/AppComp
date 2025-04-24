import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ENV } from '@environment';
import { AmplitudeService } from '../amplitude.service';

export class TrackEvent {
  name: string;
  data: Object;

  constructor(name: string, data?: Object) {
    this.name = name;
    this.data = data;
  }
}

@Injectable()
export class TrackHelper {
  static EVENTS = {
    SCAN_CARD_CLICKED: 'Clicou em escanear cartão',
    APP_SHARE: 'Compartilhou o APP',
    INIT_CONTACT: 'Clicou em "Contato"',
    OPEN_PREPAID_INFO_MODAL: 'Clicou em "Informações sobre pré-pago"',
    STORE_CHOOSE: 'Escolheu a loja',
    CREATE_ACCOUNT: 'Clicou em "Criar conta"',
    OPEN_LOGIN_PAGE: 'Abriu a página de Login',
    CREATED_ACCOUNT: 'Concluiu a criação de conta',
    LOGIN_METHOD: 'Método de login',
    OPEN_PAGE: 'Abriu página do menu:',
    OPEN_PARTNER_RESELLER: 'Abriu produtos do revendedor',
    HOME_LAST_REQUEST_SHORTCUT: 'Utilizou atalho do último pedido',
    OPEN_CHECKOUT_PAGE: 'Foi para a finalização da compra (carrinho)',
    FINISH_BUY_CLICKED: 'Clicou em finalizar compra',
    CANCEL_BUY_TO_CHANGE_STORE: 'Cancelou a compra para mudar de loja',
    BUY_SUCCESS_DONE: 'Concluiu a compra com sucesso',
    REDIRECT_USER_TO_OTHERS_SALES: 'Direcionado para aba "Outros vendedores"',
    CHOOSE_OTHERS_PRODUCTS_SEGMENT: 'Visualizou aba outros produtos',
    WRONG_DATE_WARNING: 'Recebeu aviso de data do aparelho inválida',
    NOT_KNOWN_MY_CEP_CLICK: 'Clicou em "Não sei meu CEP"',
    NEW_ADDRESS_START: 'Iniciou cadastro de endereço',
    NEW_ADDRESS_FINISH: 'Concluiu cadastro de endereço',
    NEW_ADDRESS_OUT_OF_AREA: 'Endereço fora de cobertura',
    NEW_ADDRESS_NOT_FOUND: 'Endereço não encontrado',
    OPEN_LAST_REQUESTS_MODAL: 'Abriu modal "Meus Pedidos"',
  };

  constructor(
    public platform: Platform,
    private amplitudeService: AmplitudeService
  ) {}

  isEnabled() {
    return this.platform.is('cordova') && !ENV.DEBUG;
  }

  track(trackEvent: TrackEvent): void {
    try {
      console.log(
        `Tracking event ${trackEvent.name} with data: `,
        trackEvent.data
      );
      // if (!this.isEnabled()) {
      //   return;
      // }
      this.amplitudeService.track(trackEvent.name, trackEvent.data);
    } catch (e) {
      console.error(e);
    }
  }

  trackByName(eventName?: string, data?: Object) {
    try {
      const event = new TrackEvent(eventName, data);
      this.track(event);
    } catch (e) {
      console.error(e);
    }
  }
}
