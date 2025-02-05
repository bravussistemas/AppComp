import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs';
import { AuthUserHttp } from './auth-user-http';
import { Observable, map } from 'rxjs';
import { ICreditCard } from '../shared/interfaces';
import { Sales } from '../shared/models/sales.model';
import { HttpParams } from '@angular/common/http';

export interface ICreditCardCreationData {
  card_number: string;
  brand: number;
  card_holder_name: string;
  card_holder_id: string;
}

export interface ICreditCardFinishCreationData {
  card: string;
  cvv: string;
  valid_date: string;
}

export interface IPurchaseItemData {
  product_inventory_per_day_id: number;
  amount: number;
  product_id: number;
}

export interface IPurchaseData {
  card?: number;
  price: number;
  items: IPurchaseItemData[];
  store: number;
  use_credit: boolean;
  use_pix: boolean;  
  is_free_delivery?: boolean;
  is_free_delivery_by_coupon?: boolean;
  delivery_receptionist: boolean;
  address: number;
  delivery_price: number;
  document_note?: string;
  delivery_schedule_date?: string | Date;
  delivery_schedule_observation?: string;
  real_delivery_price?: number;
  coupon_discount_price?: number;
  delivery_discount_price?: number;
  products_price?: number;
  coupon: number;
  delivery_hour: number;
  delivery_area: number;
  version?: number;
}

export interface IChangeDefaultCardDTO {
  card_id: number;
}

@Injectable()
export class CreditCardService {

  constructor(private authUserHttp: AuthUserHttp,
              private appConfig: AppConfig) {
  }

  create(data: ICreditCardCreationData): Observable<any> {
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_CREDIT_CARD),
      data
    ).pipe(
      map((resp: any) => resp)
    );
  }

  finishCreate(data: ICreditCardFinishCreationData): Observable<any> {
    return this.authUserHttp.put(
      this.getUrl(this.appConfig.API_CREDIT_CARD),
      data
    ).pipe(
      map((resp: any) => resp)
    );
  }

  validate(cardId: number): Observable<any> {
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_VALIDATE_CREDIT_CARD),
      {
        card: cardId
      }
    ).pipe(
        map((resp: any) => resp)
    );
  }

  list(params = {}): Observable<any> {
    const paramshtttp = new HttpParams()
    .set('params', params.toString()) // Define o ID da loja
    return this.authUserHttp.get(
      this.getUrl(this.appConfig.API_CREDIT_CARD),
      paramshtttp
    ).pipe(
        map((resp: any) => {
        return <ICreditCard[]>resp;
        })
    );
  }

  getDefault(): Observable<any> {
    return this.list({get_default: true});
  }

  delete(cardId: number): Observable<any> {
    const params = new HttpParams()
    .set('id', cardId) // Define o ID da loja
    return this.authUserHttp.delete(
      this.getUrl(this.appConfig.API_CREDIT_CARD),
      params
    ).pipe(
      map((resp: any) => {
      return <ICreditCard>resp;
      })
    );
  }

  createPurchase(purchaseData: IPurchaseData): Observable<Sales> {
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_CREATE_PURCHASE),
      purchaseData
    ).pipe(
      map((resp: any) => {
      return <Sales>resp;
      })
    );
  }

  setDefault(data: IChangeDefaultCardDTO): Observable<any> {
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_CHANGE_DEFAULT_CARD),
      data
    ).pipe(
      map((resp: any) => {
      return resp;
    })
    );
  }

  notifyUserCheckCardView(): Observable<any> {
    return this.authUserHttp.get(`${this.appConfig.SERVER_API}${this.appConfig.NOTIFY_USER_CHECK_VIEW}`);
  }

  getUrl(endpoint: string): string {
    return `${this.appConfig.SERVER_API}${endpoint}`;
  }

}
