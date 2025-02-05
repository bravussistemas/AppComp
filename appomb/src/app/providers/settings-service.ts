import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { AuthUserHttp } from './auth-user-http';
import { AppConfig } from '../../configs';
import { DeliveryMethod, ILastRequest, IUserSettings } from '../shared/interfaces';
import * as Raven from 'raven-js';
import { CachedServiceBase } from '../shared/cached-service-base';
import { CacheService } from 'ionic-cache';
import { AuthService } from './auth-service';
import { Storage } from '@ionic/storage';
import { DeliveryTypeEnum, Store, StoreTypeEnum } from '../shared/models/store.model';
import { DeliveryState } from './delivery-state/delivery-state';
import { LastRequestService } from './last-request-service';
import { CartManagerTable } from './database/cart-manager-table';
import { EventService } from './event.service';
import { lastValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';

const SETTINGS_LOCAL_CACHE_KEY = 'SETTINGS_USER';

@Injectable()
export class SettingsService extends CachedServiceBase {

  private currentLang: string;

  constructor(private authUserHttp: AuthUserHttp,
              private platform: Platform,
              private storage: Storage,
              private appConfig: AppConfig,
              private authService: AuthService,
              public override cache: CacheService,
              private deliveryState: DeliveryState,
              private lastRequestService: LastRequestService,
              public events: EventService,
              private cartManagerTable: CartManagerTable,
              private translate: TranslateService) {
    super('SettingsService', cache);
    moment.locale('pt');
  }

  private setSettings(settings: IUserSettings): Promise<any> {
    return this.storage.set(SETTINGS_LOCAL_CACHE_KEY, JSON.stringify(settings)).then(() => {
      return settings;
    });
  }
  
  getUserLanguage(): string {
    return navigator.language || navigator['userLanguage'];
  }
  
  private async getSettingsFromServer(params: { [key: string]: any } = {}): Promise<IUserSettings> {
    const httpParams = new HttpParams({ fromObject: params });
    const request = this.authUserHttp.get<IUserSettings>(this.getUrl(), httpParams);
    return await lastValueFrom(this.cacheRequest(this.getUrl(), request, 10));
  }

  async updateSettings(settings: IUserSettings): Promise<any> {
    let loggedIn = await this.authService.loggedIn();
    if (!loggedIn) {
      return this.setSettings(settings);
    }
    if (settings.store) {
      settings.store_id = settings.store.id;
      delete settings.store;
    }
    return this.authUserHttp.post(
      this.getUrl(), settings
    ).toPromise().then(() => {
      return this.clean().then(() => {
        return this.refreshSettings();
      })
    });
  }

  async refreshSettings(params: { with_dispatch_info?: boolean } = {}): Promise<IUserSettings> {
    let loggedIn = await this.authService.loggedIn();
    let settings;
    if (loggedIn) {
      settings = await this.getSettingsFromServer(params);
    } else {
      settings = await this.getSettings();
    }
    return this.setSettings(settings);
  }

  getSettings(): Promise<IUserSettings> {
    return this.storage.get(SETTINGS_LOCAL_CACHE_KEY).then((val) => {
      if (!val) {
        return {};
      }
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error(e);
        return {};
      }
    });
  }

  setInitialLanguage() {
    this.getUserLangCode().then((lang) => {
      this.changeLang(lang);
    }).catch((e) => Raven.captureException(e));
  }

  getCurrentLang() {
    return this.currentLang;
  }

  parseLang(lang: string): string {
    let separator = '-';
    if (lang.match(/_/)) {
      separator = '_';
    }
    return lang.split(separator)[0];
  }

  changeLang(lang: string) {
    lang = lang || '';
    this.currentLang = lang.match(/en|pt/) ? lang : 'pt';
    console.debug('Original lang returned -> ', lang);
    console.debug('Setting current lang to -> ', this.currentLang);
    this.translate.use(this.parseLang(this.currentLang));
    moment.locale(this.currentLang);
  }

  getUserLangCode(): Promise<string> {
    return new Promise((resolve) => {
      const userLanguage = navigator.language || navigator['userLanguage'];
      resolve(userLanguage); // Retorna o idioma completo (ex.: 'en-US')
    });
  }  

  getUserLocale() {
    return this.translate.getBrowserCultureLang();
  }

  getUrl(): string {
    return `${this.appConfig.SERVER_API}${this.appConfig.API_USER_SETTINGS}`;
  }

  async chooseStore(store: Store): Promise<void> {
    const settings = await this.getSettings();
    const selectedStore = settings.store;
    await this.updateSettings({store: store});
    if (!selectedStore || selectedStore.id !== store.id) {
      try {
        await this.cartManagerTable.clearDay(moment().toDate());
      } catch (e) {
        console.error(e)
      }
      this.deliveryState.clearState();
    }
    this.events.emitEvent('userChooseStore', store);
    this.deliveryState.store = store;
    if (store.store_type == StoreTypeEnum.DELIVERY) {
      this.deliveryState.deliveryMethod = DeliveryMethod.DELIVERY_METHOD_HOUSE;
    } else {
      this.deliveryState.deliveryMethod = DeliveryMethod.DELIVERY_METHOD_STORE;
    }
    try {
      const lrSettings: ILastRequest = {
        title: store.name,
        cityId: store.address.city,
        storeType: store.store_type,
        deliveryType: store.delivery_type,
        storeId: store.id,
      };
      if (store.store_type == StoreTypeEnum.DELIVERY) {
        let title = 'ENTREGA';
        if (store.delivery_type == DeliveryTypeEnum.PIZZA) {
          title += ' DE PIZZAS';
        }
        if (store.delivery_type == DeliveryTypeEnum.MAIN) {
          title += ' DE PÃES';
        }
        lrSettings.title = title;
        lrSettings.subtitle = null;
      } else if (store.address && store.address.simple_address) {
        lrSettings.title = 'LOJA';
        lrSettings.subtitle = store.address.simple_address;
      }
      this.lastRequestService.updateSettings(lrSettings);
    } catch (e) {
      console.error(e);
    }
  }
}
