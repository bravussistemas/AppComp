import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs';
import { AuthUserHttp } from './auth-user-http';
import { map, Observable } from 'rxjs';
import * as moment from 'moment';
import { HttpUtils } from '../utils/http-utils';
import { Sales } from '../shared/models/sales.model';
import { CachedServiceBase } from '../shared/cached-service-base';
import { CacheService } from 'ionic-cache';
import { HttpResponse,HttpClient, HttpParams } from '@angular/common/http';

export interface IBalanceDayDTO {
  sum_sales: string;
  sum_sales_card: string;
  sum_sales_money: string;
  sum_sales_app: string;
}

export interface ClientComingResponseDTO {
  success: boolean;
  is_client_coming: boolean;
  store_is_open: boolean;
}

@Injectable()
export class SalesService extends CachedServiceBase {
  constructor(private authUserHttp: AuthUserHttp,
              public override cache: CacheService,
              private appConfig: AppConfig) {
    super('SalesService', cache);
  }

  listFromUser(store_id: number): Observable<any> {
    let params = new HttpParams()
      .set('store_id', store_id);
    const url = this.getUrl(this.appConfig.API_LIST_PENDING_PURCHASE);
    const request = this.authUserHttp.get(url, params);
    return this.cacheRequest(url, request, 10).pipe(
      map((resp: Response) => {
      return resp;
      })
    );
  }


  loadUserSaleState(store_id: number): Observable<any> {
    let params = new HttpParams()
      .set('store_id', store_id);
    const url = this.getUrl(this.appConfig.API_USER_SALE_STATE);
    const request = this.authUserHttp.get(url, params);
    return request.pipe(
      map((resp: Response) => {
      return resp;
      })
    );
  }

  getHistoryPurchase(page = 1): Observable<Sales[]> {
    let params = new HttpParams()
      .set('page', page);
    return this.authUserHttp.get(this.getUrl(this.appConfig.API_USER_SALES), 
      params
    ).pipe(
      map((resp: Sales[]) => resp)
    );
  }

  toggleClientIsComing(store_id: number) {
    let params = new HttpParams()
      .set('store_id', store_id);
    return this.authUserHttp.get(this.getUrl(this.appConfig.API_CLIENT_IS_COMING), 
      params
    ).pipe(
      map((resp: ClientComingResponseDTO) =>resp)
    );
  }

  clientHasDispatchToday(store_id: number): Promise<boolean> {
    return this.listFromUser(store_id).toPromise().then((resp) => {
      return resp['client_has_dispatch_today'];
    }).catch(this.handlerError.bind(this));
  };

  isClientComing(store_id: number): Promise<boolean> {
    return this.listFromUser(store_id).toPromise().then((resp) => {
      return resp['is_client_coming_today'];
    }).catch(this.handlerError.bind(this));
  };

  getBalanceDay(store_id: number, day: moment.Moment): Observable<IBalanceDayDTO> {
    const params = new HttpParams()
      .set('store_id', store_id.toString()) // Converte o número para string
      .set('day', HttpUtils.dateToUrl(day)); // Certifique-se de que este método retorna uma string válida
  
    return this.authUserHttp.get<IBalanceDayDTO>(
      this.getUrl(this.appConfig.API_STORE_BALANCE_DAY),
       params  // Passe `params` como parte de um objeto
    ).pipe(
      map((resp: IBalanceDayDTO) => resp) // Mapeia a resposta diretamente como `IBalanceDayDTO`
    );
  }

  getUrl(endpoint: any): string {
    return `${this.appConfig.SERVER_API}${endpoint}`;
  }

  handlerError(e) {
    console.error(e);
  }

}
