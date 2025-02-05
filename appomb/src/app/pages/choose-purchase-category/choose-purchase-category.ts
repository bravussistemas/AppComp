import { Component, OnDestroy } from '@angular/core';
import { ActionSheetController, NavController, NavParams, ModalController, Platform} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingHelper } from '../../utils/loading-helper';
import { LoadStoreStateResponse, StoreService } from '../../providers/store-service';
import { DeliveryTypeEnum, Store, StoreTypeEnum } from '../../shared/models/store.model';
import { AppConfigService, IAppConfig } from '../../providers/app-config.service';
import { Subscription } from 'rxjs';
import { ToastHelper } from '../../utils/toast-helper';
import { LastRequestService } from '../../providers/last-request-service';
import { ILastRequest } from '../../shared/interfaces';
import { TrackHelper } from '../../providers/track-helper/track-helper';
import { DispatchOrderService } from '../../providers/dispatch-order.service';
import { DispatchOrderRequests } from '../../shared/models/dispatch-order.model';
import { AuthService } from '../../providers/auth-service';
import { User } from '../../shared/models/user.model';
import { StoreOptionsMenuPopoverComponent } from '../../components/store-options-menu-popover/store-options-menu-popover';
import { Utils } from '../../utils/utils';
import { EventService } from 'src/app/providers/event.service';

@Component({
  selector: 'page-choose-purchase-category',
  templateUrl: './choose-purchase-category.html',
  styleUrl: './choose-purchase-category.scss',
})
export class ChoosePurchaseCategory implements OnDestroy {
  storeType = StoreTypeEnum;
  deliveryType = DeliveryTypeEnum;
  appConfigServiceSub: Subscription;
  appConfig: IAppConfig;
  lastRequestSettings: ILastRequest;
  disableBtns = false;
  userSales: DispatchOrderRequests[];
  hasPendingSales: boolean = false;
  hasPendingSalesToday: boolean = false;
  user: User;
  storesState: LoadStoreStateResponse;
  hasErrorLoadStoreState = false;
  firstOpenModalIgnored = false;
  store: Store;

  constructor(public modalCtrl: ModalController,
              navParams: NavParams,
              public storeService: StoreService,
              private appConfigService: AppConfigService,
              private trackHelper: TrackHelper,
              private events: EventService,
              private lastRequestService: LastRequestService,
              private dispatchOrderService: DispatchOrderService,
              public actionSheetCtrl: ActionSheetController,
              private toastHelper: ToastHelper,
              private loadingHelper: LoadingHelper,
              public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  isDeliveryEmployee() {
    return this.user && this.store && this.user.delivery_employee_id && this.store.store_type == StoreTypeEnum.DELIVERY;
  }

  isAdminOrStoreSeller(user: User, store: Store) {
    return Utils.isAdminOrStoreSeller(user, store);
  }

  getHeaderAction() {
    if (this.isAdminOrStoreSeller(this.user, this.store) || this.isDeliveryEmployee()) {
      return {
        icon: 'barcode',
        iconClass: '',
        handler: (event) => {
          this.router.navigate(['/AdmManageProductPage']);
        }
      }
    }
    if (this.hasPendingSalesToday) {
      return {
        icon: 'basket',
        handler: (event) => {
          this.router.navigate(['/UserRequestsHistoryPage']);
        },
        iconClass: 'pending-sale-icon'
      }
    }
    return {};
  }

  loadAppConfig() {
    this.appConfigServiceSub = this.appConfigService.getActive$.subscribe((config) => {
      if (!config) {
        return;
      }
      this.appConfig = config;
    });
  }

  loadUserSales() {
    this.loadingHelper.setLoading('listUserSales', true);
    this.auth.getUser().then((user) => {
      this.user = user;
      if (!user || user.is_staff || user.is_store_seller) {
        this.loadingHelper.setLoading('listUserSales', false);
        return;
      }
      this.dispatchOrderService.listUserSales().subscribe((resp) => {
        this.loadingHelper.setLoading('listUserSales', false);
        this.hasPendingSales = resp.has_any_open;
        this.hasPendingSalesToday = resp.has_any_open_today;
        this.userSales = resp.data;
      }, () => {
        this.loadingHelper.setLoading('listUserSales', false);
      });
    }, () => {
      this.loadingHelper.setLoading('listUserSales', false);
    });
  }

  updateUserStore = (store: Store) => {
    this.store = store;
  };

  ngOnInit() {
    // Inscrevendo-se no evento 'userChooseStore' usando EventService
    this.events.onEvent('userChooseStore').subscribe((store) => {
      this.updateUserStore(store);
    });
  
    this.disableBtns = false;
    this.loadingHelper.setLoading('loadStoreState', true);
  
    // Carregando estado da loja
    this.storeService.loadStoreState().subscribe(
      (resp) => {
        this.loadingHelper.setLoading('loadStoreState', false);
        this.loadAppConfig();
        this.loadUserSales();
        this.storesState = resp;
      },
      () => {
        this.loadingHelper.setLoading('loadStoreState', false);
        this.hasErrorLoadStoreState = true;
        this.loadAppConfig();
        this.loadUserSales();
      }
    );
  
    // Carregando configurações do último pedido
    this.lastRequestService.getSettings().then(
      (settings) => (this.lastRequestSettings = settings)
    );
  }
  

  isValidLastRequestSettings() {
    return LastRequestService.isValidSettings(this.lastRequestSettings);
  }

  get title() {
    return this.loadingHelper.isLoadingAny() ? '' : 'oh my bread!';
  }

  get loading() {
    return this.loadingHelper.isLoading('setSettings') || this.loadingHelper.isLoading('storesList') || this.loadingHelper.isLoading('listUserSales') || this.loadingHelper.isLoading('loadStoreState');
  }

  goToChooseStore(params) {
    this.router.navigate(['/ChooseStore'],{queryParams:params});
  }

  chooseLastRequest() {
    const {cityId, storeType, storeId, deliveryType} = this.lastRequestSettings;
    this.goToChooseStore({cityId, storeType, storeId, deliveryType});
    try {
      const data = {store_id: storeId, city_id: cityId, store_type: storeType};
      this.trackHelper.trackByName(TrackHelper.EVENTS.HOME_LAST_REQUEST_SHORTCUT, data);
    } catch (e) {
      console.error(e);
    }
  }

  chooseStores(storeType?: StoreTypeEnum, deliveryType?: DeliveryTypeEnum) {
    this.disableBtns = true;
    const timout = setTimeout(() => {
      this.loadingHelper.show();
    }, 500);
    this.storeService.getStoresCities(storeType, deliveryType).subscribe(async (resp) => {
      clearTimeout(timout);
      this.loadingHelper.hide();
      this.disableBtns = false;
      const buttons = resp.data.map((item) => {
        return {
          text: item.label,
          handler: () => {
            this.goToChooseStore({cityId: item.city_id, storeType: storeType, deliveryType: deliveryType});
          }
        }
      });
      
      if (buttons.length === 1 && deliveryType != DeliveryTypeEnum.PIZZA) {
        buttons[0].handler();
      } else {
        const actionSheet = this.actionSheetCtrl.create({
          header: 'Escolha um local',
          buttons: [
            ...buttons, {
              text: 'Cancelar',
              role: 'cancel'
            }
          ]
        });
        (await actionSheet).present();
      }
    }, (e) => {
      clearTimeout(timout);
      this.loadingHelper.hide();
      this.disableBtns = false;
      this.toastHelper.connectionError();
      console.error(e);
    });
  }  

  ngOnDestroy(): void {
    if (this.appConfigServiceSub) {
      this.appConfigServiceSub.unsubscribe();
    }
    this.events.unsubscribe('userChooseStore');
  }

  onOpenSheet() {
    if (!this.hasPendingSales || (this.hasPendingSales && this.firstOpenModalIgnored)) {
      this.trackHelper.trackByName(TrackHelper.EVENTS.OPEN_LAST_REQUESTS_MODAL);
    } else {
      this.firstOpenModalIgnored = true;
    }
  }

}
