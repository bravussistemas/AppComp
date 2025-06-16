import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs';
import { map, Observable } from 'rxjs';
import {
  DeliveryTypeEnum,
  Store,
  StoreTypeEnum,
} from '../shared/models/store.model';
import { CachedServiceBase } from '../shared/cached-service-base';
import { CacheService } from 'ionic-cache';
import { CartManagerTable } from './database/cart-manager-table';
import { HttpClient } from '@angular/common/http';
import { EventService } from './event.service';

export interface StoreCities {
  city_id: number;
  state_id: number;
  label: string;
}

export interface StoreCitiesResponse {
  data: StoreCities[];
  success: boolean;
}

export interface LoadStoreStateResponse {
  has_normal_stores: boolean;
  has_delivery_main: boolean;
  has_delivery_pizza: boolean;
}

export interface GetStoreNextValidOpenedDaysResponse {
  days: string[];
  today: string;
  tomorrow: string;
}

@Injectable()
export class StoreService extends CachedServiceBase {
  store: Store;

  constructor(
    private authUserHttp: HttpClient,
    private events: EventService,
    private cartManagerTable: CartManagerTable,
    public override cache: CacheService,
    private appConfig: AppConfig
  ) {
    super('StoreService', cache);
  }

  setStore(store: Store) {
    if (!this.store || !store || store.id !== this.store.id) {
      this.store = store;
      this.cartManagerTable.clear().then(() => {
        this.events.emitEvent('changeStore', store);
      });
    } else {
      this.store = store;
      this.events.emitEvent('changeStore', store);
    }
  }

  getStores(
    cityId?: number,
    storeType?: number,
    deliveryType?: number
  ): Observable<Store[]> {
    const url = this.getUrl(this.appConfig.API_STORES);
    let reqparams = {
        city_id: cityId,
        exclude_by_default: true,
      ...(storeType != null && { store_type: storeType }),
      ...(deliveryType != null && { delivery_type: deliveryType })
      }
    let finalRequest = this.authUserHttp.get(url, {
      params: reqparams
    });
    return finalRequest.pipe(map((res: any) => <Store[]>res.results));
  }

  getStoresCities(
    storeType?: StoreTypeEnum,
    deliveryType?: DeliveryTypeEnum
  ): Observable<StoreCitiesResponse> {
    const url = this.getUrl(this.appConfig.API_LIST_STORES_CITIES);
    let key = url;
    if (storeType) {
      key += storeType;
    }
    if (deliveryType) {
      key += deliveryType;
    }  
    let reqparams = null;
    if (storeType != null) {
      reqparams = {
        store_type: storeType,
        delivery_type: deliveryType,
      };  
    };
    const request = this.authUserHttp.get(url, {
      params: reqparams,
    });

    return this.cacheRequest(key, request, 60 * 60).pipe(
      map((res: any) => {
        return <StoreCitiesResponse>res;
      })
    );
  }

  loadStoreState(): Observable<LoadStoreStateResponse> {
    const url = this.getUrl(this.appConfig.API_GET_STORES_STATE);
    const request = this.authUserHttp.get(url, { params: { test: 4 } });
    return request.pipe(
      map((res: any) => {
        return <LoadStoreStateResponse>res;
      })
    );
  }

  getStoreNextValidOpenedDays(
    storeId: number
  ): Observable<GetStoreNextValidOpenedDaysResponse> {
    const url = this.getUrl(
      this.appConfig.API_GET_STORE_NEXT_VALID_OPENED_DAYS
    );
    const request = this.authUserHttp.get(url, { params: { id: storeId } });
    return request.pipe(
      map((res: any) => {
        return <GetStoreNextValidOpenedDaysResponse>res;
      })
    );
  }

  getUrl(path): string {
    return `${this.appConfig.SERVER_API}${path}`;
  }
}
