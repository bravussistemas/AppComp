import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  IonHeader,
  MenuController,
  NavController,
  ModalController,
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, StoreTypeEnum } from '../../shared/models/store.model';
import { StoreService } from '../../providers/store-service';
import { SettingsService } from '../../providers/settings-service';
import { LoadingHelper } from '../../utils/loading-helper';
import {
  DeliveryMethod,
  ILastRequest,
  IUserProfile,
  IUserSettings,
} from '../../shared/interfaces';
import { TranslateService } from '@ngx-translate/core';
import { AlertHelper } from '../../utils/alert-helper';
import { map } from 'rxjs/operators';
import { AuthService } from '../../providers/auth-service';
import { ToastHelper } from '../../utils/toast-helper';
import {
  AdminStoreService,
  ChangeOrderDTO,
} from '../../providers/admin-store.service';
import {
  TrackEvent,
  TrackHelper,
} from '../../providers/track-helper/track-helper';
import { DeliveryState } from '../../providers/delivery-state/delivery-state';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { AppConfigService } from '../../providers/app-config.service';
import { LastRequestService } from '../../providers/last-request-service';
import { Utils } from '../../utils/utils';

interface StoreByType {
  delivery: Store[];
  normal: Store[];
  points: Store[];
  others: Store[];
}

export let parseStoresToReorder = (items: Store[]): ChangeOrderDTO[] => {
  return items.map((item) => {
    return { id: item.id, item_order: items.indexOf(item) };
  });
};

const orderStoresByType = (stores: Store[]): StoreByType => {
  const result: StoreByType = {
    delivery: [],
    normal: [],
    points: [],
    others: [],
  };
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    if (store.store_type === StoreTypeEnum.DELIVERY) {
      result.delivery.push(store);
      continue;
    }
    if (store.store_type === StoreTypeEnum.NORMAL) {
      result.normal.push(store);
      continue;
    }
    if (store.store_type === StoreTypeEnum.POINT_OF_SALES) {
      result.points.push(store);
      continue;
    }
    result.normal.push(store);
  }
  return result;
};

@Component({
  selector: 'app-page-choose-store',
  templateUrl: 'choose-store.html',
})
/* eslint-disable @angular-eslint/component-class-suffix */
export class ChooseStore implements OnInit, OnDestroy {
  stores: Store[] = [];
  afterCurrentStoreDeleted = false;
  selectedStore: Store;
  reorder: boolean;
  storesByType: StoreByType;
  sectionTitles = {
    delivery: 'Entregas',
    normal: 'Lojas',
    points: 'Pontos de venda',
    others: 'Outras',
  };
  @ViewChild(IonHeader) header: IonHeader;

  user: User;
  profile: IUserProfile;
  isAdmin = false;
  menuSwipeEnabled = true;
  showBackButton = true;

  cityId: number;
  storeType: number;
  deliveryType: number;
  storeId: number;

  appConfigServiceSub: Subscription;
  bannerSrc: string;

  ignoreAmountStoresHideLoading = false;

  get isReordering() {
    return this.reorder != null;
  }

  constructor(
    public navCtrl: NavController,
    private loadingHelper: LoadingHelper,
    private adminStoreService: AdminStoreService,
    private settingsService: SettingsService,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private appConfigService: AppConfigService,
    private trans: TranslateService,
    private toastHelper: ToastHelper,
    private alertHelper: AlertHelper,
    private deliveryState: DeliveryState,
    private trackHelper: TrackHelper,
    private lastRequestService: LastRequestService,
    private menuCtrl: MenuController,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get subtitle() {
    return this.loadingHelper.isLoadingAny()
      ? ''
      : 'Receba em casa ou retire nas lojas!';
  }

  startReorder() {
    this.reorder = true;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.cityId = params['cityId'];
      this.storeType = params['storeType'];
      this.deliveryType = params['deliveryType'];
      this.storeId = params['storeId'];
      this.afterCurrentStoreDeleted =
        params['afterCurrentStoreDeleted'] === 'true'; // Convertendo para booleano
    });

    this.appConfigServiceSub = this.appConfigService.getActive$.subscribe(
      (config) => {
        if (!config) {
          return;
        } else {
          this.bannerSrc = config.choose_store_bg.thumbnail;
        }
      }
    );

    this.loadingHelper.setLoading('storesList', true);
    this.authService.isAdmin().then((isAdmin) => {
      this.isAdmin = isAdmin;
    });
    this.authService.getUser().then((user) => {
      this.user = user;
    });
    this.authService.getUserProfile().then((profile) => {
      this.profile = profile;
    });
    this.settingsService.getSettings().then((result: IUserSettings) => {
      this.selectedStore = result.store;
      this.loadStores();
    });

    this.loadingHelper.clear();
    this.loadingHelper.setLoading('storesList', true);
  }

  ionViewWillEnter() {
    if (this.afterCurrentStoreDeleted) {
      this.trans
        .get(['CURRENT_STORE_WAS_REMOVED', 'TITLE_CURRENT_STORE_WAS_REMOVED'])
        .toPromise()
        .then((val) => {
          this.alertHelper.show(
            val.TITLE_CURRENT_STORE_WAS_REMOVED,
            val.CURRENT_STORE_WAS_REMOVED
          );
        });
    }
    this.enableNavigation(false);
  }

  ionViewWillLeave() {
    this.enableNavigation(true);
  }

  enableNavigation(enabled: boolean) {
    this.menuCtrl.enable(enabled);
    this.menuSwipeEnabled = enabled;
    this.showBackButton = enabled;
  }

  chooseStore(store: Store, autoSelect = false) {
    console.log('Selecionou a loja: ');
    console.log(store);
    if (store) {
      const event = new TrackEvent(TrackHelper.EVENTS.STORE_CHOOSE, {
        store_id: store.id,
      });
      this.trackHelper.track(event);
    }
    this.loadingHelper.setLoading('setSettings', true);
    this.settingsService
      .chooseStore(store)
      .then(() => {
        return this.redirectSelectStore(store, autoSelect);
      })
      .catch((e) => {
        console.error(e);
        this.toastHelper.connectionError();
        this.loadingHelper.setLoading('setSettings', false);
      });
  }

  getRedirectFunc(store: Store, autoSelect = false): Promise<any> {
    if (!this.user) {
      return this.router.navigate(['/HomeList']);
    }
    if (this.isAdmin || Utils.canAdminStore(this.user, store)) {
      return this.router.navigate(['/AdmManageProductPage']);
    }
    if (
      this.user.is_store_seller &&
      this.user.stores_seller_ids.indexOf(store.id) !== -1
    ) {
      return this.router.navigate(['/HomeList']);
    }
    if (this.user.delivery_employee_id) {
      return this.router.navigate(['/ListDispatchDeliveryPage']);
    }
    if (store.store_type == StoreTypeEnum.DELIVERY) {
      if (this.profile) {
        if (autoSelect) {
          return this.lastRequestService.getSettings().then((settings) => {
            if (settings && parseInt(<any>settings.userAddressId) > 0) {
              return this.createRedirectToChooseAddressPromise({
                userAddressId: settings.userAddressId,
              });
            }
            return this.createRedirectToChooseAddressPromise();
          });
        }
        if (
          !this.profile.has_address_valid ||
          !this.deliveryState.deliveryAddress
        ) {
          return this.createRedirectToChooseAddressPromise();
        }
      }
    }
    return this.router.navigateByUrl('/HomeList');
  }

  createRedirectToChooseAddressPromise(params?) {
    console.log('Chamando ChooseDeliveryAddressPage com params: ');
    const routeParams = {
      goToAfter: 'HomePage',
      redirectType: 'setRoot',
      ...params,
      onSelect: () => {
        this.authService.getUserProfile().then((profile) => {
          profile.has_address_valid = true;
          return this.authService.setUserProfile(profile);
        });
      },
    };
    console.log(routeParams);
    return this.router.navigate(['/ChooseDeliveryAddressPages'], {
      queryParams: routeParams,
    });
  }

  async redirectSelectStore(store: Store, autoSelect = false) {
    this.getRedirectFunc(store, autoSelect).then(() => {
      this.storeService.setStore(store);
      this.loadingHelper.setLoading('setSettings', false);
    });
  }

  setStoreList(stores: any) {
    this.stores = stores.results;

    this.storesByType = orderStoresByType(this.stores);

    if (this.storesByType.delivery && this.storesByType.delivery.length) {
      this.sectionTitles = {
        delivery: 'Delivery',
        normal: 'Retirar na loja',
        points: 'Pontos de venda',
        others: 'Outras',
      };
    }

    this.loadingHelper.setLoading('storesList', false);
  }

  loadStores() {
    this.loadingHelper.setLoading('storesList', true);

    this.storeService
      .getStores(this.cityId, this.storeType, this.deliveryType)
      .subscribe(
        (res) => {
          if (res.length === 1 && !this.afterCurrentStoreDeleted) {
            this.chooseStore(res[0]);
            this.ignoreAmountStoresHideLoading = true;
          }

          this.setStoreList(res);
        },
        (err) => {
          console.error('Erro ao carregar lojas:', err);
          this.loadingHelper.setLoading('storesList', false);
          this.toastHelper.connectionError();
        }
      );
  }

  get title() {
    const name = 'oh my bread!';
    return this.loadingHelper.isLoadingAny() ? '' : name.toUpperCase();
  }

  mustShowStoreList() {
    return (
      this.stores &&
      (this.ignoreAmountStoresHideLoading ||
        this.stores.length >= 1 ||
        this.afterCurrentStoreDeleted) &&
      !this.loading()
    );
  }

  loading() {
    return (
      this.loadingHelper.isLoading('setSettings') ||
      this.loadingHelper.isLoading('storesList')
    );
  }

  cancelReorder() {
    this.trans.get(['CANCEL', 'CANCEL_REORDER']).subscribe((val) => {
      this.alertHelper
        .confirm(val.CANCEL, val.CANCEL_REORDER)
        .then((isConfirmed) => {
          if (isConfirmed) {
            this.reorder = null;
            this.toastHelper.show({
              message: 'Alterações CANCELADAS',
              duration: 2000,
            });
            this.loadStores();
          }
        });
    });
  }

  saveReorder() {
    let stores: Store[] = [];
    for (let item in this.storesByType) {
      let items = this.storesByType[item];
      if (items && items.length) {
        stores.push(...items);
      }
    }
    this.loadingHelper.show();
    this.adminStoreService
      .changeStoresOrder(parseStoresToReorder(stores))
      .subscribe(
        () => {
          this.loadingHelper.hide();
          this.toastHelper.show({
            message: 'Ordem alterada com sucesso',
            cssClass: 'toast-success',
            duration: 1500,
          });
          this.reorder = null;
          this.storeService.clean();
        },
        () => {
          this.loadingHelper.hide();
          this.trans.get(['ERROR', 'ERROR_REQUEST']).subscribe((res: any) => {
            this.alertHelper.show(res.ERROR, res.ERROR_REQUEST);
          });
        }
      );
  }

  ngOnDestroy(): void {
    if (this.appConfigServiceSub) {
      this.appConfigServiceSub.unsubscribe();
    }
  }
}
