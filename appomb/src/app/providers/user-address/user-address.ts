import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfig } from '../../../configs';
import { HttpProviderBase } from '../http-provider-base';
import { Address } from '../../shared/models/address.model';
import { Utils } from '../../utils/utils';
import { Store } from '../../shared/models/store.model';
import { HttpParams } from '@angular/common/http';

export interface UserAddress {
  id: number;
  address: Address;
  is_favorite: boolean;
  name: string;
}

export interface CreateUserAddressDO {
  street: string;
  number: number;
  complement: string;
  without_complement: boolean;
  ref: string;
  district: string;
  city: number;
  state: number;
  city_name: string;
  state_abbr: string;
  zip_code: string;
  store: number;
}

export interface CreateUserAddressSimpleDO {
  street: string;
  number: number;
  complement: string;
  without_complement: boolean;
  ref: string;
  district: number;
  city: number;
  state: number;
  city_name: string;
  district_name: string;
  state_abbr: string;
  zip_code: string;
  store: number;
}

export interface ResultUserAddressCreated {
  has_point: boolean;
  in_delivery_area: boolean;
  data: UserAddress;
  other_store_in_area: Store | null;
}

export interface DeliveryHourSimple {
  id: number;
  start_hour: string;
  end_hour: string;
  is_full: boolean;
  is_past: boolean;
  is_before_next_batch?: boolean;
}

export interface AddressDeliveryInfo {
  id: number;
  delivery_area: number;
  store_id: number;
  delivery_price: number;
  free_delivery_price: number;
  free: boolean;
  has_valid_hour: boolean;
  delivery_hours: DeliveryHourSimple[];
  invalid_dh_ids: number[];
}

export interface ListUseAddressOptions {
  store_id: string;
}

export interface ListUseAddressResponse {
  acceptable: UserAddress[];
  not_acceptable: UserAddress[];
}

@Injectable()
export class UserAddressProvider extends HttpProviderBase {
  constructor(injector: Injector, private appConfig: AppConfig) {
    super(injector);
  }

  private mapToJson(resp: any) {
    try {
      return Utils.mapToJson(resp);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  list(options: ListUseAddressOptions): Observable<ListUseAddressResponse> {
    const params = new HttpParams().set('store_id', options.store_id);
    const url = this.buildUrl({
      path: this.appConfig.API_USER_ADDRESS_LIST,
    });
    return this.client.get<ListUseAddressResponse>(url, params).pipe(
      map(this.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }

  createSimple(data: CreateUserAddressSimpleDO): Observable<ResultUserAddressCreated> {
    const url = this.buildUrl({
      path: this.appConfig.API_ADD_USER_ADDRESS_SIMPLE,
    });
    return this.client.post<ResultUserAddressCreated>(url, data).pipe(
      map(this.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }

  create(data: CreateUserAddressDO): Observable<ResultUserAddressCreated> {
    const url = this.buildUrl({
      path: this.appConfig.API_ADD_USER_ADDRESS,
    });
    return this.client.post<ResultUserAddressCreated>(url, data).pipe(
      map(this.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }

  delete(userAddress: UserAddress): Observable<{ success: boolean; detail: string }> {
    const params = new HttpParams().set('id', userAddress.id.toString());
    const url = this.buildUrl({
      path: this.appConfig.API_USER_ADDRESS,
    });
    return this.client.delete<{ success: boolean; detail: string }>(url, params).pipe(
      map(this.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }

  getDeliveryInfo(address: Address, storeId: number): Observable<AddressDeliveryInfo> {
    const params = new HttpParams()
      .set('address_id', address.id.toString())
      .set('store_id', storeId.toString());
    const url = this.buildUrl({
      path: this.appConfig.API_ADDRESS_DELIVERY_INFO,
    });
    return this.client.get<AddressDeliveryInfo>(url, params).pipe(
      map(this.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }
}
