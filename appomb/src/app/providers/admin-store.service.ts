import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { AppConfig } from '../../configs';
import { AuthUserHttp } from './auth-user-http';
import { map, Observable, catchError, throwError } from 'rxjs';
import { Sales } from '../shared/models/sales.model';
import { IPurchaseItemData } from './credit-card.service';
import { Moment } from 'moment';
import { DeliveryEmployeeSimple } from '../shared/models/store.model';
import { CachedServiceBase } from '../shared/cached-service-base';
import { CacheService } from 'ionic-cache';

export interface ChangeOrderDTO {
  id: number;
  item_order: number;
}

export enum PaymentMethods {
  CARD = 1,
  MONEY = 2,
  CARD_IN_STORE = 4,
}

export interface ICreateSaleData {
  price: number;
  address: number;
  delivery_price: number;
  document_number?: string;
  real_delivery_price?: number;
  items: IPurchaseItemData[];
  store: number;
  payment_method: number;
  document_note: string;
}

@Injectable()
export class AdminStoreService extends CachedServiceBase {
  constructor(
    private authUserHttp: AuthUserHttp,
    private appConfig: AppConfig,
    public override cache: CacheService
  ) {
    super('AdminStoreService', cache);
  }

  toggleDispatchClosed(
    id: number,
    isClosed: boolean
  ): Observable<{ status: boolean }> {
    return this.authUserHttp.post<{ status: boolean }>(
      this.getUrl(this.appConfig.API_TOGGLE_DISPATCH_CLOSED_V2),
      { id, is_closed: isClosed }
    );
  }

  changeOrder(data: ChangeOrderDTO[]): Observable<{ status: boolean }> {
    return this.authUserHttp.post<{ status: boolean }>(
      this.getUrl(this.appConfig.API_CHANGE_INVENTORY_ORDER),
      data
    );
  }

  changeStoresOrder(data: ChangeOrderDTO[]): Observable<{ status: boolean }> {
    return this.authUserHttp.post<{ status: boolean }>(
      this.getUrl(this.appConfig.API_CHANGE_STORES_ORDER),
      data
    );
  }

  changeProductsOrder(data: ChangeOrderDTO[]): Observable<{ status: boolean }> {
    return this.authUserHttp.post<{ status: boolean }>(
      this.getUrl(this.appConfig.API_CHANGE_PRODUCTS_ORDER),
      data
    );
  }

  changeResellersOrder(data: {
    day: Moment;
    data: ChangeOrderDTO[];
  }): Observable<{ status: boolean }> {
    return this.authUserHttp.post<{ status: boolean }>(
      this.getUrl(this.appConfig.API_CHANGE_RESELLERS_ORDER),
      data
    );
  }

  changeProductsVisibles(data: any): Observable<{ status: boolean }> {
    return this.authUserHttp.post<{ status: boolean }>(
      this.getUrl(this.appConfig.API_EDIT_PRODUCTS_VISIBLE),
      data
    );
  }

  createSale(saleData: ICreateSaleData): Observable<Sales> {
    return this.authUserHttp
      .post<Sales>(this.getUrl(this.appConfig.API_ADMIN_CREATE_SALE), saleData)
      .pipe(
        map((resp: any) => <Sales>resp),
        catchError((e) => this.handleHttpError(e))
      );
  }

  balanceGeneral(data: {
    store_id: number;
    page: number;
    period_type: 'week' | 'month' | 'day';
    delivery_employee_id?: number;
  }) {
    const params = new HttpParams({ fromObject: { ...data } });

    return this.authUserHttp
      .get<Sales>(this.getUrl(this.appConfig.API_STORE_GENERAL_BALANCE), params)
      .pipe(
        map((resp: any) => <Sales>resp),
        catchError((e) => this.handleHttpError(e))
      );
  }

  listDeliveryEmployee() {
    const request = this.authUserHttp.get(
      this.getUrl(this.appConfig.API_LIST_DELIVERY_EMPLOYEE)
    );
    return this.cacheRequest('listDeliveryEmployee', request, 60 * 60 * 8).pipe(
      map((resp: any) => <DeliveryEmployeeSimple[]>resp),
      catchError((e) => this.handleHttpError(e))
    );
  }

  setDispatchDeliveryEmployee(data: {
    employee_id: number;
    dispatch_id: number;
  }) {
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_SET_DISPATCH_DELIVERY_EMPLOYEE),
      data
    );
  }

  balanceGeneralV2(data: {
    store: number;
    page: number;
    period_type: 'week' | 'month' | 'day';
    delivery_employee?: number;
  }) {
    const params = new HttpParams({ fromObject: { ...data } });
    console.log(params);

    return this.authUserHttp
      .get<any>(
        this.getUrl(this.appConfig.API_STORE_GENERAL_BALANCE_CONTENT),
        params
      )
      .pipe(
        map((resp: any) => <any>resp),
        catchError((e) => this.handleHttpError(e))
      );
  }

  listDeliveryEmployees() {
    return this.authUserHttp
      .get(this.getUrl(this.appConfig.API_LIST_DELIVERY_EMPLOYEES))
      .pipe(
        map((resp: any) => <any>resp),
        catchError((e) => this.handleHttpError(e))
      );
  }

  getUrl(endpoint: string): string {
    return `${this.appConfig.SERVER_API}${endpoint}`;
  }

  private handleHttpError(error: any): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(error);
  }
}
