import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs';
import { AuthUserHttp } from './auth-user-http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import {
  DispatchOrder,
  DispatchOrderRequests,
} from '../shared/models/dispatch-order.model';
import { Sales } from '../shared/models/sales.model';
import { Address } from '../shared/models/address.model';

export interface CancelSaleDTO {
  dispatch_id: number;
  sale_id: number;
}

export interface ReportProblemDTO {
  problem_type: number;
  message?: string;
  dispatch_order: number;
}

@Injectable()
export class DispatchOrderService {
  constructor(
    private authUserHttp: AuthUserHttp,
    private appConfig: AppConfig
  ) {}

  get(id: number): Observable<DispatchOrder> {
    return this.authUserHttp.get<DispatchOrder>(`${this.getUrl(id.toString())}/`);
  }

  listSales(id: number): Observable<Sales[]> {
    return this.authUserHttp.get<Sales[]>(
      `${this.appConfig.SERVER_API}${this.appConfig.API_DISPATCH_ORDERS_SALES}${id}`
    );
  }

  listUserSales({ only_opened = false } = {}): Observable<{
    data: DispatchOrderRequests[];
    has_any_open: boolean;
    has_any_open_today: boolean;
  }> {
    const params = new HttpParams().set('only_opened', String(only_opened));

    return this.authUserHttp.get(
      this.getUrl(this.appConfig.API_USER_DISPATCH_ORDERS),
      params
    );
  }

  getDispatchSale(id: number): Observable<Sales> {
    const params = new HttpParams().set('d_id', id.toString());
    return this.authUserHttp.get<Sales>(
      `${this.appConfig.SERVER_API}${this.appConfig.API_GET_DISPATCH_SALE}`,
      params
    );
  }

  cancelSale(
    data: CancelSaleDTO
  ): Observable<{ success: boolean; is_admin_sale: boolean }> {
    return this.authUserHttp.post<{ success: boolean; is_admin_sale: boolean }>(
      `${this.appConfig.SERVER_API}${this.appConfig.API_CANCEL_SALE}`,
      data
    );
  }

  notifyDeliveryEmployeeIsComing(
    dispatchId: number
  ): Observable<{ success: boolean; address: Address }> {
    const params = new HttpParams().set('dispatch_id', dispatchId.toString());
    return this.authUserHttp.get<{ success: boolean; address: Address }>(
      `${this.appConfig.SERVER_API}${this.appConfig.API_NOTIFY_USER_DELIVERY_INCOMING}`,
      params
    );
  }

  setDispatchRating({
    id,
    rating,
  }: {
    id: number;
    rating: number;
  }): Observable<{ success: boolean }> {
    const params = new HttpParams()
      .set('dispatch_id', id.toString())
      .set('rating', rating.toString());
    return this.authUserHttp.get<{ success: boolean }>(
      `${this.appConfig.SERVER_API}${this.appConfig.API_SET_DISPATCH_RATING}`,
      params
    );
  }

  reportProblem(data: ReportProblemDTO): Observable<{ success: boolean }> {
    return this.authUserHttp.post<{ success: boolean }>(
      `${this.appConfig.SERVER_API}${this.appConfig.API_REPORT_USER_DISPATCH_ORDER}`,
      data
    );
  }

  private getUrl(endpoint: any): string {
    const cleanedEndpoint = endpoint.startsWith('api/')
      ? endpoint.slice(4)
      : endpoint;
    return `${this.appConfig.SERVER_API}${this.appConfig.API_DISPATCH_ORDERS}${cleanedEndpoint}`;
  }
}
