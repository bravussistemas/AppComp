import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../configs';
import { AuthUserHttp } from './auth-user-http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

export interface CouponInvalidError {
  id: number;
  reason: string;
  reason_detail: string;
}

export interface CouponUserRegisterList {
  coupons: CouponUserRegister[];
  count: number;
  invalid_coupons: CouponInvalidError[];
}

export interface CouponUserRegister {
  id: number;
  coupon: Coupon;
  is_used: boolean;
}

export interface Coupon {
  id: number;
  title: string;
  rules: string[];
  description: string;
  code: string;
  amount_discount: string;
  amount_discount_display: string;
  amount_discount_delivery_price: string;
  amount_discount_delivery_price_display: string;
  min_sale_price: string;
  is_percentage: boolean;
  is_active: boolean;
  only_online_card: boolean;
  max_uses_per_user: number;
  max_uses: number;
  date_start: string;
  date_end: string;
}

@Injectable()
export class CouponsService {

  constructor(private authUserHttp: AuthUserHttp,
              private appConfig: AppConfig) {
  }

  getActives(storeId: number): Observable<CouponUserRegisterList> {
    console.log(storeId);
    const params = new HttpParams()
      .set('store_id', storeId); // Define o ID da loja
    return this.authUserHttp
      .get(this.getUrl(this.appConfig.API_LIST_COUPON), params
      ).pipe(
        map((resp) => resp)
      );
  }

  register({coupon, storeId}: { coupon: string; storeId: number }) {
    const params = new HttpParams()
    .set('', coupon) // Define o ID da loja
    .set('store_id', storeId); // Define o ID da loja
    return this.authUserHttp
      .post(this.getUrl(this.appConfig.API_REGISTER_COUPON), {
        coupon,
        store_id: storeId
      }).pipe(
        map((resp) => resp)
      );
  }

  delete(id: any) {
    const params = new HttpParams()
    .set('id', id) // Define o ID da loja
    return this.authUserHttp
      .delete(this.getUrl(this.appConfig.API_DELETE_COUPON), params);
  }

  getUrl(url): string {
    return `${this.appConfig.SERVER_API}${url}`;
  }

}
