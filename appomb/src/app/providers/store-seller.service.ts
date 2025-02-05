import { Injectable } from '@angular/core';
import { AuthUserHttp } from './auth-user-http';
import { AppConfig } from '../../configs';
import { Store } from '../shared/models/store.model';
import { map, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

export interface StoreSeller {
  send_new_sale_push_notification: boolean;
  send_delivery_finish_notification: boolean;
}

@Injectable()
export class StoreSellerService {
  constructor(private authUserHttp: AuthUserHttp,
              private appConfig: AppConfig) {
  }

  update(store: Store, storeSeller: Partial<StoreSeller>) {
    return this.authUserHttp.post(this.getUrl(this.appConfig.API_STORE_SELLER), {
      ...storeSeller,
      store_id: store.id
    })
  }

  getSeller(store: Store): Observable<StoreSeller> {
    const params = new HttpParams()
    .set('store_id', store.id);
    return this.authUserHttp.get(this.getUrl(this.appConfig.API_STORE_SELLER), 
      params
    ).pipe(
      map((resp: StoreSeller) => {
      return resp;
      })
    );
  }

  getUrl(url): string {
    return `${this.appConfig.SERVER_API}${url}`;
  }
}
