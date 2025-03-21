import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import {EventService} from '../../providers/event.service';
import { IonContent, ModalController, Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckoutService, DayInventory } from '../../providers/checkout-service';
import { CartManagerTable } from '../../providers/database/cart-manager-table';
import { Store, StoreTypeEnum } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { DeliveryMethod, ICreditCard, IUserSettings } from '../../shared/interfaces';
import { LoadingHelper } from '../../utils/loading-helper';
import * as moment from 'moment';
import { AlertHelper } from '../../utils/alert-helper';
import { TranslateService } from '@ngx-translate/core';
import * as Raven from 'raven-js';
import { PageNoteComponent } from '../../components/page-note/page-note';
import { AuthService } from '../../providers/auth-service';
import { ToastHelper } from '../../utils/toast-helper';
import { User } from '../../shared/models/user.model';
import { Utils } from '../../utils/utils';
import { TrackHelper } from '../../providers/track-helper/track-helper';
import { CouponInvalidError, CouponUserRegister } from '../../providers/coupons.service';
import { AdminStoreService } from '../../providers/admin-store.service';
import { DeliveryState, DeliveryStateData } from '../../providers/delivery-state/delivery-state';
import { AddressDeliveryInfo,  DeliveryHourSimple,  UserAddressProvider } from '../../providers/user-address/user-address';
import { Observable, Subscription } from 'rxjs';
import { CreditCardService, IPurchaseItemData } from '../../providers/credit-card.service';
import { AppConfig } from '../../../configs';
import { UserCreditService } from '../../providers/user-credit.service';
import { Address } from '../../shared/models/address.model';
import { Sales } from '../../shared/models/sales.model';
import { FIRST_PAGE_APP } from '../../shared/constants';
//import { Response } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseError } from '../../utils/response-helper';
import { TransactionErrorHelper } from '../../utils/transaction-error-helper';
import { AlertController } from '@ionic/angular';
import { PixService } from '../../providers/pix.service';
import { RequestStatusPage } from '../request-status/request-status';
import { CardErrorPopUp } from '../card-error-pop-up/card-error-pop-up';

export function deliveryHourToDate(deliveryHour: string): Date {
  return moment(deliveryHour, 'HH:mm:ss').toDate()
}

function getMoreSoonPossibleDeliveryHour(dateLimit: Date, data: DeliveryHourSimple[], invalidIds: number[]): DeliveryHourSimple {
  if (!data) {
    return null;
  }
  let first = null;
  for (let i = 0; i < data.length; i++) {
    const deliveryHourSimple = data[i];
    if (invalidIds && invalidIds.length && invalidIds.indexOf(deliveryHourSimple.id) !== -1) {
      continue;
    }
    if (!first) {
      first = deliveryHourSimple;
    }
    if (!dateLimit) {
      return first;
    }
    const hour = deliveryHourToDate(deliveryHourSimple.start_hour);
    if (hour >= dateLimit) {
      return deliveryHourSimple;
    }
  }
  return first;
}

const PAYMENT_MODE = {
  MONEY: 2,
  CREDIT: 4,
  DEBIT: 5
};
declare let cordova: any;

@Component({
  selector: 'page-checkout-complete',
  templateUrl: './checkout-complete.html',
  styleUrls: ['./checkout-complete.scss'],
})
export class CheckoutComplete implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  get productsPriceWithCouponDiscountPrice(): number {
    return this.productsPrice - this.couponDiscountPrice;
  }

  hasError() {
    return false;
  }

  isEmptyList() {
    return this.days.length === 0;
  }

  isPixPayment() {
    return this.pix_pixcopiacola != '';
  }

  get total(): number {
    if (this.inSellerMode(this.user, this.store)) {
      return this.productsPrice
    }
    let totalToPay = 0;
    if (this.isForDelivery) {
      totalToPay += this.productsPriceAndDelivery
    } else {
      totalToPay += this.productsPrice
    }
    totalToPay -= this.totalDiscount;
    return Math.max(totalToPay, 0);
  }

  get productsPriceAndDelivery() {
    let result = 0;
    if (this.productsPrice) {
      result += this.productsPrice;
    }
    if (!this.isFreeDelivery) {
      result += this.realDeliveryPrice;
    }
    return result;
  }

  paymentModes = PAYMENT_MODE;
  deliveryPrice: number = 0;
  freeDeliveryPrice: number = 0;
  updating = false;
  defaultCard: ICreditCard;
  store: Store;
  docNote: string;
  alreadyLoaded = false;
  scheduleDeliveryDate: { date: Date; observation: string };
  cardList: ICreditCard[] = [];
  user: User;
  selectedFinishMethod = null;
  useCredit = null;
  deliveryStateData: DeliveryStateData;
  deliveryAddressInfo: AddressDeliveryInfo;
  userCreditBalance: number;
  storewithpix = false;
  userCreditBalanceError = false;
  possibleDeliveryHour = null;
  tipopagamento:string = 'cartao'; 
    
  pix_pixcopiacola:string = '';  
  pix_remainingTime: number = 300;
  pix_count: number = 0;   
  pix_timer: string = '';
  pix_sale: Sales;

  firstInit = true;
  deliveryReceptionist = this.appConfig.DELIVERY_RECEPTIONIST_DEFAULT_VALUE;
  notHasDeliveryHour = false;

  deliveryStateSub: Subscription;

  lastAddressIdLoaded = null;

  data: DayInventory = {};
  days: string[] = [];  
  productsPrice: number = 0;
  couponRegister: CouponUserRegister;
  couponErrors: CouponInvalidError[];

  @ViewChild('rootContent') rootContent: IonContent;
  @ViewChild(PageNoteComponent) pageNote: PageNoteComponent;

  constructor(private cartManagerTable: CartManagerTable,
              private creditCardService: CreditCardService,
              private adminStoreService: AdminStoreService,
              public platform: Platform,
              public loadingHelper: LoadingHelper,
              private appConfig: AppConfig,
              private auth: AuthService,
              private alertHelper: AlertHelper,
              private events: EventService,
              private toastHelper: ToastHelper,
              private trans: TranslateService,
              private trackHelper: TrackHelper,
              private modalCtrl: ModalController,
              private settingsService: SettingsService,
              private userCreditService: UserCreditService,
              private userAddressProvider: UserAddressProvider,
              private deliveryState: DeliveryState,
              private navCtrl: NavController,
              private renderer: Renderer2,
              private checkoutService: CheckoutService,
              private pix: PixService,
              public alertCtrl: AlertController,            
              private router: Router,
              private route: ActivatedRoute,) {    
  }

  get userCreditBalanceDisplay() {
    if (!this.useCredit) {
      return this.userCreditBalance;
    }
    return this.userCreditBalance - this.total;
  }

  get couponDiscountPrice() {
    if (this.canApplyCoupon) {
      const amountDiscount = parseFloat(this.couponRegister.coupon.amount_discount) || 0;
      if (this.couponRegister.coupon.is_percentage) {
        return parseFloat((this.productsPrice * (amountDiscount / 100)).toFixed(2))
      } else {
        return amountDiscount;
      }
    }
    return 0;
  }

  getTimerClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10);
    this.pix_remainingTime = sec_num; //Define variable
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);    
    var minutesString = '';
    var secondsString = '';    
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();      
    return minutesString + ':' + secondsString;    
  }

  startTimer() {   
    var counter = setTimeout(() => {
      var time = this.getTimerClock(this.pix_remainingTime);      
      this.pix_timer = time
      if (this.pix_remainingTime < 0)
        return;
      if (this.pix_remainingTime > 0) {
        this.startTimer();
        this.pix_remainingTime--;
        this.pix_count++;
        if (this.pix_count == 10){
          this.pix_count = 0;
          this.consultarpix();
        }
      }
      else {   
        this.desativarpix();     
        this.toastHelper.show({
          message: 'Tempo limite de pagamento atingido!',
          duration: 3000,
          cssClass: 'toast-error',
        });
      }
    }, 1000);
  }

  desativarpix(){
    this.pix_pixcopiacola = '';
    this.tipopagamento = 'cartao';
    this.pix_count = 0;
    this.pix_remainingTime = 300;    
  }
  
  consultarpix(){    
    this.pix.get({sale_id: this.pix_sale.id}).subscribe((res: any) => {
      if (res.status=='finalizado'){
        this.pix_remainingTime = -1;
        this.onSuccessPay(this.pix_sale);
      }
      else if (res.status=='negado'){
        this.pix_remainingTime = 0;
        this.desativarpix();
        this.toastHelper.show({
          message: 'Pix cancelado!',
          duration: 3000,
          cssClass: 'toast-error',
        });
      }
      else if (res.status=='erro'){
        this.pix_remainingTime = 0;
        this.desativarpix();
        this.toastHelper.show({
          message: 'Erro ao processar o pix favor entrar em contato!',
          duration: 3000,
          cssClass: 'toast-error',
        });
      }
    });
  }

  clicoucopiar(){    
    if(!this.platform.is('cordova')) {
      this.toastHelper.show({message: 'Plataforma não permite copiar, copie de forma manual!', duration: 1500});
      return;
    }
    else{
      cordova.plugins.clipboard.copy(this.pix_pixcopiacola);
      this.toastHelper.show({message: 'Copiado com sucesso!', duration: 1500});
    }    
  }

  selectPaymentMode(value) {
    this.selectedFinishMethod = value;
  }

  get deliveryPriceCouponDiscount() {
    if (this.canApplyCoupon) {
      const amountDiscount = parseFloat(this.couponRegister.coupon.amount_discount_delivery_price) || 0;
      const di = this.deliveryAddressInfo;
      if (di && !this.isFreeDeliveryByPrice && di.delivery_price) {
        return parseFloat((di.delivery_price * (amountDiscount / 100)).toFixed(2))
      }
    }
    return 0;
  }

  get realDeliveryPrice() {
    if (this.isFreeDelivery) {
      return 0
    }
    return Math.max(this.deliveryPrice - this.deliveryPriceCouponDiscount, 0)
  }

  get totalDiscount() {
    return this.couponDiscountPrice
  }

  get deliveryAddress() {
    return this.deliveryStateData ? this.deliveryStateData.address : null
  }

  get isFreeDelivery() {
    return this.isFreeDeliveryByPrice || this.isFreeDeliveryByCoupon
  }

  get isFreeDeliveryByPrice() {
    const di = this.deliveryAddressInfo;
    return Boolean(
      di && (di.free === true || (di.free_delivery_price
      && this.productsPrice >= di.free_delivery_price))
    );
  }

  get isFreeDeliveryByCoupon() {
    const di = this.deliveryAddressInfo;
    return Boolean(di && di.delivery_price <= this.deliveryPriceCouponDiscount);
  }

  get mustShowChooseDeliveryHour() {
    return this.store && this.store.user_can_choose_delivery_hour && this.isForDelivery;
  }

  get isDocumentNoteRequired() {
    if (!this.store) return false
    if(this.inSellerMode(this.user, this.store)){
      return false
    }
    if (!this.store.show_document_note_option) return false
    if (!this.store.document_note_option_required) return false
    if (this.store.document_note_option_required === 'delivery' && !this.isForDelivery) {
      return false
    }
    if (this.store.document_note_option_required === 'store' && !this.isForDelivery) {
      return true
    }
    return true
  }

  loadDeliveryAddressInfo(address: Address, store: Store) {
    if (this.lastAddressIdLoaded && this.lastAddressIdLoaded == address.id) {
      console.log('Address info already loaded');
      return;
    }
    this.lastAddressIdLoaded = address.id;
    this.loadingHelper.setLoading('deliveryAddressInfo', true);
    this.userAddressProvider.getDeliveryInfo(address, store.id)
      .subscribe((data) => {
        this.deliveryAddressInfo = data;
        this.calculateDeliveryHour(data);
        this.deliveryPrice = data.delivery_price || 0;
        this.freeDeliveryPrice = data.free_delivery_price || 0;
        this.updateReservationInfo();
        this.loadingHelper.setLoading('deliveryAddressInfo', false);
        if (!data.has_valid_hour && store.user_can_choose_delivery_hour) {
          this.notHasDeliveryHour = true;
          this.notifyNotHasDeliveryHour();
        }
      }, () => {
        this.loadingHelper.setLoading('deliveryAddressInfo', false);
      });
  }

  

  get canApplyCoupon() {
    return this.couponRegister && this.couponRegister.coupon &&
      (this.couponRegister.coupon.amount_discount || this.couponRegister.coupon.amount_discount_delivery_price)
      && this.productsPrice && this.productsPrice > this.minimunCoupon;
  }

  get minimunCoupon() {
    return parseInt(this.couponRegister && this.couponRegister.coupon && this.couponRegister.coupon.min_sale_price, 10) || 0;
  }

  notifyNotHasDeliveryHour() {
    this.alertHelper.show('Sem horário para entrega disponível', 'Já encerramos as entregas ou todos os horários estão preenchidos. Confira nossos horários clicando em "Horário para entrega"');
  }

  calculateDeliveryHour(data?: AddressDeliveryInfo) {
    data = data || this.deliveryAddressInfo;
    this.cartManagerTable.getMoreLateNextBach().then(date => {
      let possibleDeliveryHour;
      if (data) {
        possibleDeliveryHour = getMoreSoonPossibleDeliveryHour(date, data.delivery_hours, data.invalid_dh_ids)
      }
      if (possibleDeliveryHour) {
        this.possibleDeliveryHour = possibleDeliveryHour;
      }
    });
  }

  cancelDay(day) {
    this.trans.get(['CANCEL_RESERVATION_ITEMS', 'WANT_CANCEL_RESERVATION']).toPromise().then((result) => {
      this.alertHelper.confirm(result.CANCEL_RESERVATION_ITEMS, result.WANT_CANCEL_RESERVATION).then((confirmed) => {
        if (confirmed) {
          this.loadingHelper.show();
          this.cartManagerTable.clearDay(moment(day).toDate())
            .then(() => {
              this.loadCheckoutList(true);
              this.loadingHelper.hide();
            })
            .catch(e => {
              Raven.captureException(e);
              this.loadingHelper.hide();
              throw e;
            });

        }
      })
    });
  }

  addMoreItems() {
    this.router.navigate(['/home']);
  }

  eventCartChangedCheckout = (data) => {
    if (data.auto) {
      this.loadCheckoutList();
    }
  };

  loadUserPaymentData(user: User, store: Store) {
    this.loadingHelper.setLoading('finishCheckoutBar', true);
    this.userCreditService.getMyBalance().subscribe((resp) => {
      this.userCreditBalance = resp.balance;
      this.userCreditBalanceError = false;
      this.updateReservationInfo();
      if (this.firstInit) {
        this.firstInit = false;
        if (this.inSellerMode(user, store)) {
          this.loadingHelper.setLoading('finishCheckoutBar', false);
        } else {
          this.creditCardService.getDefault().subscribe((resp) => {
            this.setCardList(resp);
            this.loadingHelper.setLoading('finishCheckoutBar', false);
          }, () => {
            this.toastHelper.connectionError()
            this.loadingHelper.setLoading('finishCheckoutBar', false);
          });
        }
      } else {
        this.loadingHelper.setLoading('finishCheckoutBar', false);
      }

    }, (e) => {
      console.error(e);
      this.loadingHelper.setLoading('finishCheckoutBar', false);
      this.userCreditBalanceError = true;
      this.toastHelper.connectionError();
    });
  }

  loadDeliveryInfo(store: Store) {
    this.loadingHelper.setLoading('deliveryInfo', true);
    this.deliveryStateSub = this.deliveryState.state$.subscribe((state) => {
      if (!state) {
        this.loadingHelper.setLoading('deliveryInfo', false);
      } else {
        this.deliveryStateData = state;
        if (state.address && state.method == DeliveryMethod.DELIVERY_METHOD_HOUSE) {
          this.loadDeliveryAddressInfo(state.address, store);
        }
        this.loadingHelper.setLoading('deliveryInfo', false);
      }
    }, () => {
      this.loadingHelper.setLoading('deliveryInfo', false);
    });
  }

  loadPixInfo(store: Store) {
    this.loadingHelper.setLoading('pixinfo', true);
    this.pix.verifypix(store.id).subscribe((resp) => {      
      this.storewithpix = resp.result;    
      console.log(this.storewithpix) 
    })
  }

  ngOnInit() {
    this.trackHelper.trackByName(TrackHelper.EVENTS.OPEN_CHECKOUT_PAGE);
    this.auth.getUser().then((user) => {
      this.user = user;
  
      // Subscrição dos eventos
      this.subscriptions.push(
        this.events.onEvent('creditCard').subscribe((data) => this.eventCreditCardChanged(data)),
        this.events.onEvent('loadCouponsList').subscribe(() => this.loadCouponsEvent()),
        this.events.onEvent('couponDeleted').subscribe(() => this.loadCouponsEvent()),
        this.events.onEvent('documentNoteUpdated').subscribe((data) => this.documentNoteUpdatedEvent(data)),
        this.events.onEvent('scheduleDeliveryDateChanged').subscribe((data) => this.scheduleDeliveryDateChanged(data))
      );

      if (this.deliveryStateSub) {
        this.subscriptions.push(this.deliveryStateSub);
      }
  
      this.productsPrice = 0;
  
      this.cartManagerTable.init()
        .then(() => {
          this.settingsService.getSettings().then((resp) => {
            this.updateUserSettings(resp);
            this.loadCheckoutList();
  
            this.subscriptions.push(
              this.events.onEvent('cartChanged').subscribe((data) => this.eventCartChangedCheckout(data)),
              this.events.onEvent('cartChanged').subscribe(() => this.eventUpdateReservationInfo())
            );
  
            this.loadUserPaymentData(user, resp.store);
            this.loadDeliveryInfo(resp.store);
            this.loadPixInfo(resp.store);
          }).catch(() => this.toastHelper.connectionError());
        });
    });
  }

  loadCheckoutList(afterClearDay = false) {
    this.loadingHelper.setLoading('checkoutList', true);
    this.cartManagerTable.init().then(() => {
      this.cartManagerTable.getFuture().then((result) => {
        if (result.length > 0) {
          let ids = [];
          for (let i = 0; i < result.length; i++) {
            if (result[i]) {
              ids.push(result[i].inventory_day_id);
            }
          }
          this.checkoutService.getByIds(ids, this.store.id).toPromise().then((resp) => {
            this.reset();
            const data = resp.data;
            for (let day in data) {
              if (data.hasOwnProperty(day)) {
                this.days.push(day);
              }
            }
            this.couponErrors = resp.coupon_errors;
            this.couponRegister = resp.coupon;
            this.data = data;
            this.loadingHelper.setLoading('checkoutList', false);
            this.alreadyLoaded = true;
          }).catch(() => {
            this.toastHelper.connectionError();
            this.loadingHelper.setLoading('checkoutList', false);
          });
        } else {
          if (afterClearDay) {
            this.router.navigate(['/home']);
          } else {
            this.reset();
            this.loadingHelper.setLoading('checkoutList', false);
          }
        }
      }).catch(() => {
        this.loadingHelper.setLoading('checkoutList', false);
      });
    }).catch(() => {
      this.loadingHelper.setLoading('checkoutList', false);
    });
  }

  reset() {
    this.data = {};
    this.days = [];
  }

  eventCreditCardChanged = (card: ICreditCard) => {  // Ionic Events requires arrow functions to make right unsubscribe
    this.defaultCard = card;
  };

  eventUpdateReservationInfo = () => {  // Ionic Events requires arrow functions to make right unsubscribe
    if (!this.updating) {
      this.updateReservationInfo();
    }
  };

  setCardList(cardList: ICreditCard[]) {
    this.cardList = cardList;
    if (cardList && cardList.length) {
      this.defaultCard = cardList[0];
      if (this.defaultCard.card_number) {
        this.defaultCard.card_number = Utils.reduceCardMask(this.defaultCard.card_number);
      }
    }
  }

  updateUserSettings(userSettings: IUserSettings) {
    this.store = userSettings.store;
    this.docNote = userSettings.document_note;
  }

  ngOnDestroy() {      
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadCouponsEvent = () => {
    this.loadCheckoutList();
  };

  documentNoteUpdatedEvent = (value) => {
    this.docNote = value;
  };

  scheduleDeliveryDateChanged = (value) => {
    this.scheduleDeliveryDate = value;
  };

  canPayWithUserCredit() {
    return this.userCreditBalance && (this.total <= this.userCreditBalance);
  }

  updateReservationInfo() {
    this.updating = true;
    this.cartManagerTable.getCartInfo()
      .then((data) => {
        this.productsPrice = data.totalToPay;
        if (this.useCredit || this.useCredit == null) {
          this.useCredit = this.canPayWithUserCredit();
        }
        this.updating = false;
      })
      .catch((e) => {
        console.error(e);
        this.updating = false;
        Raven.captureException(e)
      });
  }

  showSuccessMessageAndRedirect(sale: Sales) {
    if (this.inSellerMode(this.user, this.store)) {
      // Navegação moderna usando o Router
      this.router.navigate(['/home']).then(() => {
        this.toastHelper.show({
          message: 'Venda efetuada com sucesso!',
          duration: 1000,
          cssClass: 'toast-success',
        });
      }).catch((e) => console.error(e));
    } else {
      // Navegação para a Home e exibição de modal
      this.router.navigate(['/home']).then(async () => {
        try {
          const modal = await this.modalCtrl.create({
            component: RequestStatusPage, // Substitua pelo componente correto
            componentProps: { sale: sale },
          });
          await modal.present();
        } catch (e) {
          console.error(e);
        }
      }).catch((e) => console.error(e));
    }
  }

  async onSuccessPay(sale: Sales) {
    try {
      // Atualiza créditos do usuário, se aplicável
      if (this.useCredit) {
        this.events.emitEvent('userCreditChanged'); // Substitui publish pelo método atualizado
      }
  
      this.loadingHelper.hide();
  
      // Rastreia sucesso da compra, se houver total
      if (this.total) {
        this.trackHelper.trackByName(TrackHelper.EVENTS.BUY_SUCCESS_DONE, { total: this.total.toString() });
      }
  
      // Prepara deleções dos itens do carrinho
      const deletions: Promise<any>[] = sale.product_sales.map((productSale) =>
        this.cartManagerTable.deleteByInventoryDayId(productSale.inventory_day)
      );
  
      // Aguarda todas as deleções e redireciona após o sucesso
      await Promise.all(deletions);
      this.showSuccessMessageAndRedirect(sale);
    } catch (e) {
      // Captura erros e ainda redireciona para mostrar sucesso
      Raven.captureException(e);
      console.error(e);
      this.showSuccessMessageAndRedirect(sale);
    }
  }

  doPayAction() {
    this.loadingHelper.show('Enviando seu pedido... <br> Por favor, não feche o app ainda ;)');
    this.cartManagerTable.getCartInfo()
      .then((data) => {
        this.cartManagerTable.getFuture()
          .then((rows) => {
            let items: IPurchaseItemData[] = [];
            let totalToPay = this.total;            
            if (this.productsPrice != data.totalToPay) {
              this.loadingHelper.hide();
              this.alertHelper.show('Erro', 'Problema ao registrar informações da compra, tente novamente.');
              throw Error('Invalid sales price')
            }
            let delivery_schedule_date = null;
            let delivery_schedule_observation = null;
            let deliveryAddressId = null;
            let deliveryHourId = null;
            let deliveryAreaId = null;
            if (this.isForDelivery && this.deliveryState) {
              if (this.deliveryState.deliveryAddress && this.deliveryState.deliveryAddress.id) {
                deliveryAddressId = this.deliveryState.deliveryAddress.id;
              }
              if (this.deliveryState.deliveryHour && this.deliveryState.deliveryHour.id) {
                deliveryHourId = this.deliveryState.deliveryHour.id;
              }
              deliveryAreaId = this.deliveryAddressInfo ? this.deliveryAddressInfo.delivery_area : null
            }
            if (this.scheduleDeliveryDate && this.scheduleDeliveryDate.date) {
              if (this.scheduleDeliveryDate.date instanceof Date) {
                delivery_schedule_date = moment(this.scheduleDeliveryDate.date).format('YYYY-MM-DD');
              } else {
                delivery_schedule_date = this.scheduleDeliveryDate.date
              }
            }
            if (this.scheduleDeliveryDate && this.scheduleDeliveryDate.observation) {
              delivery_schedule_observation = this.scheduleDeliveryDate.observation;
            }
            for (let i = 0; i < rows.length; i++) {
              let row = rows[i];
              items.push({
                product_inventory_per_day_id: row.inventory_day_id,
                amount: row.amount,
                product_id: row.product_id
              })
            }
            if (this.inSellerMode(this.user, this.store)) {
              // create purchase for admin users (employers)              
              this.handlePayRequest(this.adminStoreService.createSale({
                price: totalToPay,
                store: this.store.id,
                items: items,
                payment_method: this.selectedFinishMethod,
                delivery_price: this.deliveryPrice,
                real_delivery_price: this.realDeliveryPrice,
                address: deliveryAddressId,
                document_note: this.docNote,
              }));
            } else {
              // create purchase for normal users (clients)
              let chosedcard: number;             
              if (this.tipopagamento == 'pix')
                chosedcard = null
              else
                chosedcard = this.defaultCard ? this.defaultCard.id : null;
                
              this.handlePayRequest(this.creditCardService.createPurchase({
                version: 2,
                card: chosedcard,
                price: totalToPay,
                store: this.store.id,
                items: items,
                use_credit: this.useCredit,  
                use_pix: this.tipopagamento == 'pix',                
                delivery_receptionist: this.deliveryReceptionist,
                delivery_price: this.deliveryPrice,
                real_delivery_price: this.realDeliveryPrice,
                delivery_hour: deliveryHourId,
                delivery_area: deliveryAreaId,
                address: deliveryAddressId,
                coupon: this.canApplyCoupon ? this.couponRegister.id : null,
                is_free_delivery: this.isFreeDelivery,
                is_free_delivery_by_coupon: this.isFreeDeliveryByCoupon,
                coupon_discount_price: this.couponDiscountPrice,
                delivery_discount_price: this.deliveryPriceCouponDiscount,
                products_price: this.productsPrice,
                delivery_schedule_date,
                delivery_schedule_observation,
                document_note: this.docNote
              }));
            }

          });

      }).catch(this.handlePayError.bind(this));
  }

  useCreditChanged(useCredit) {
    if (useCredit && !this.canPayWithUserCredit()) {
      this.alertHelper.show(
        'Saldo insuficiente',
        'Seu saldo é inferior ao valor da compra. <br><br>Você pode adicionar mais saldo em qualquer uma de nossas lojas.'
      );
      setTimeout(() => {
        this.useCredit = false;
      }, 50);

    }
  }

  get canConfirmRequest() {
    let liberadoformapagamento: Boolean;
    if (this.tipopagamento == 'cartao') 
      liberadoformapagamento = !this.mustSelectCreditCard
    else
      liberadoformapagamento = true;
    return Boolean(
      liberadoformapagamento &&
      this.selectedDeliveryHourValid() &&
      !this.mustSelectDeliveryAddress &&
      !this.mustAddDocumentNote &&
      !this.mustSelectDeliveryDate
    )
  }

  get mustSelectCreditCard() {
    if (this.tipopagamento == 'cartao') 
      return !this.defaultCard && !this.useCredit && !this.inSellerMode(this.user, this.store);
    else
      return false;
  }  

  async handlePayRequest(payRequest: Observable<any>) {
    payRequest.subscribe(async (sale: Sales) => {
      if (sale.payment_type == 6 ){ 
        this.loadingHelper.hide();       
        this.pix.create({          
          idloja: this.store.id,
          sale_id: sale.id
        }).subscribe((res: any) => {          
          this.pix_pixcopiacola = res.copiacola;            
          this.startTimer();  
          this.pix_sale = sale;        
        });
      }
      else {
        if (sale.is_approved) {
          this.onSuccessPay(sale);
        } else {
          this.loadingHelper.hide();
          let message = null;
          if (sale && sale.message) {
            const error = TransactionErrorHelper.byMessage(sale.message);
            if (error) {
              message = error.label
            }
          }
          const modal = await this.modalCtrl.create({
            component: CardErrorPopUp,
            componentProps: { message: message },
          });
  
          await modal.present();
  
          modal.onDidDismiss().catch(() => {
            this.alertHelper.show('Não autorizado', 'A compra não foi autorizada.');
          });
        }
      }
    }, (error) => {
      this.handlePayError(error);
    });

  }

  get mustSelectDeliveryAddress() {
    return Boolean(this.isForDelivery && (!this.deliveryStateData || !this.deliveryStateData.address))
  }

  get mustAddDocumentNote() {
    return Boolean(this.isDocumentNoteRequired && !this.docNote)
  }

  get mustSelectDeliveryDate() {
    const enabled = Boolean(this.store.show_schedule_delivery_option && this.store.schedule_delivery_option_required);
    return Boolean(enabled && (!this.scheduleDeliveryDate || !this.scheduleDeliveryDate.date))
  }

  payAction() {
    if (this.user && this.inSellerMode(this.user, this.store)) {
      if (this.selectedFinishMethod === null) {
        this.toastHelper.show({message: 'Escolha o médoto de pagamento.', duration: 1500});
        return;
      }
      this.doPayAction();
      return;
    }
    if (this.notHasDeliveryHour) {
      this.notifyNotHasDeliveryHour();
      return;
    }
    if (!this.defaultCard && !this.useCredit && this.tipopagamento=='cartao') {
      this.router.navigate(['/register-credit-card'], { 
        queryParams: { redirectAfter: 'CheckoutComplete' } 
      }).then(() => {
        this.toastHelper.show({ message: 'Cadastre um cartão para finalizar a sua compra.' });
      }).catch((error) => {
        console.error('Erro ao navegar para RegisterCreditCard:', error);
      });        
      return;
    }
    if (!this.storewithpix && this.tipopagamento=='pix'){
      this.toastHelper.show({message: 'A loja escolhida não possui pagamento por pix'})
      return;
    }
    if (this.mustSelectDeliveryDate) {
      this.goToChooseScheduleDeliveryDate();
      return;
    }
    if (this.mustSelectDeliveryAddress) {
      this.goToChooseAddress();
      return;
    }
    if (!this.selectedDeliveryHourValid()) {
      this.goToChooseDeliveryHour();
      return;
    }
    if (this.mustAddDocumentNote) {
      this.goToRegisterDocumentNote().then(() => {
        this.toastHelper.show({message: 'Cadastre um documento para a geração do cupom fiscal.'})
      });
      return;
    }
    if (this.total) {
      this.trackHelper.trackByName(TrackHelper.EVENTS.FINISH_BUY_CLICKED, {total: this.total.toString()});
    }

    if (this.isForDelivery) {
      this.doPayAction();
    } else {
      this.trans.get(['TITLE_CONFIRM_STORE_BUY', 'CHANGE_STORE', 'CONFIRM']).subscribe((val) => {
        this.alertHelper.confirm(
          val.TITLE_CONFIRM_STORE_BUY,
          this.store.address.get_simple_address,
          val.CONFIRM,
          val.CHANGE_STORE,
          'alert-confirm-store'
        ).then((confirmed) => {
          if (confirmed) {            
              this.doPayAction();
          } else {
            this.trackHelper.trackByName(TrackHelper.EVENTS.CANCEL_BUY_TO_CHANGE_STORE);
            this.router.navigate(['/first-page-app']);
          }
        });
      });
    }
  }

  goToChooseScheduleDeliveryDate() {
    const params: any = this.scheduleDeliveryDate || {};
    this.router.navigate(['/choose-schedule-delivery-date'], {
      queryParams: {
        date: params.date,
        observation: params.observation,
      },
    }).catch((error) => {
      console.error('Erro ao navegar para ChooseScheduleDeliveryDate:', error);
    });
  }

  goToRegisterDocumentNote() {
    return this.router.navigate(['/RegisterDocumentNote'],{
      queryParams: {
        document: this.docNote,
      },
    });
  }

  goToChooseDefaultCard() {
    if (this.useCredit) {
      return;
    }
    if (this.defaultCard) {
      this.router.navigate(['/ListCreditCardPage'], {queryParams: {action: 'toChooseDefault'}})
    } else {
      this.router.navigate(['/RegisterCreditCard'], {queryParams: {redirectAfter: 'CheckoutComplete'}});
    }
  }

  goToChooseCoupon() {
    if (this.couponErrors && this.couponErrors.length) {
      this.router.navigate(['/CouponsPage'], {queryParams: {redirectAfter: 'pop'}})
    } else if (!this.hasCoupon) {
      this.router.navigate(['/CouponsRegisterPage'], {queryParams: {redirectAfter: 'pop'}})
    } else {
      this.router.navigate(['/CouponsPage'], {queryParams: {redirectAfter: 'pop'}})
    }
  }

  goToChooseAddress() {
    this.router.navigate(['/ChooseDeliveryAddressPage']);
  }

  selectedDeliveryHourValid() {
    if (this.user && this.user.is_staff) {
      return true;
    }
    if (!this.store || this.store.store_type != StoreTypeEnum.DELIVERY) {
      return true;
    }
    if (!this.mustShowChooseDeliveryHour) {
      return true;
    }
    if (!this.deliveryAddressInfo) {
      return false;
    }
    if (!this.deliveryAddressInfo.invalid_dh_ids) {
      return true;
    }
    if (!this.deliveryStateData || !this.deliveryStateData.hour || !this.deliveryStateData.hour.id) {
      return false;
    }
    const deliveryHour = this.deliveryAddressInfo.delivery_hours.find((item) => {
      return item.id == this.deliveryStateData.hour.id;
    });
    if (!deliveryHour) {
      return false;
    }
    if (deliveryHour.is_past) {
      return false;
    }
    if (!deliveryHour || deliveryHour.start_hour != this.deliveryStateData.hour.start_hour || deliveryHour.end_hour != this.deliveryStateData.hour.end_hour) {
      return false;
    }
    return this.deliveryAddressInfo.invalid_dh_ids.indexOf(this.deliveryStateData.hour.id) === -1;
  }

  goToChooseDeliveryHour() {
    if (!this.deliveryAddressInfo) {
      this.goToChooseAddress();
      return;
    }
    this.router.navigate(['/ChooseDeliveryHourPage'], {queryParams: {
      items: this.deliveryAddressInfo.delivery_hours,
      possibleDeliveryHour: this.possibleDeliveryHour
    }});
  }

  toggleDeliveryReceptionist() {
    this.deliveryReceptionist = !this.deliveryReceptionist;
  }

  handlePayError(error: Response) {
    this.loadingHelper.hide();
    // todo: i18n
    if (error instanceof Response) {
      let serverResponse = new ResponseError(error);
      let defaultMsg = `Ocorreu um erro ao finalizar a sua compra, entre em contato conosco para verificar o ocorrido.`;
      if (serverResponse.status === 400) {
        this.alertHelper.show('Erro', serverResponse.getErrorMessage() || defaultMsg);
      } else {
        this.alertHelper.show('Erro', defaultMsg)
      }
    } else {
      this.alertHelper.show('Erro', 'Ocorreu um erro ao finalizar a sua compra, verifique a sua conexão com a internet.');
    }
  }

  get isLoading() {
    return (!this.alreadyLoaded && this.loadingHelper.isLoading('checkoutList')) ||
      this.loadingHelper.isLoading('finishCheckoutBar') ||
      this.loadingHelper.isLoading('deliveryInfo') ||
      this.loadingHelper.isLoading('deliveryAddressInfo');
  }

  get isForDelivery() {
    return this.store && this.store.store_type == StoreTypeEnum.DELIVERY;
  }

  inSellerMode(user: User, store: Store) {
    if (!user || !store) {
      return false;
    }
    return user.is_staff || Utils.sellerStoreInOwnStore(user, store);
  }

  onItemChangeAmount(amount) {
    if (amount === 0) {
      this.loadCheckoutList();
      this.calculateDeliveryHour();
    }
  }

  get hasCoupon() {
    return this.couponRegister && this.couponRegister.id && this.couponRegister.coupon && this.couponRegister.coupon.id;
  }

  testDecimalField(value) {
    return Boolean(value && parseFloat(value))
  }

  changeDocNoteValue(event) {
    this.docNote = event.value;
  }
}
