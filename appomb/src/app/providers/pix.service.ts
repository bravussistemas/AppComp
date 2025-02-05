import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs';
import { AuthUserHttp } from './auth-user-http';
import { map, Observable } from 'rxjs';
import { ICreditCard } from '../shared/interfaces';
import { Sales } from '../shared/models/sales.model';
import { HttpParams } from '@angular/common/http';

export interface IPIXCreationData {
  idloja: number; 
  sale_id: number; 
}


@Injectable()
export class PixService {

  constructor(private authUserHttp: AuthUserHttp,
              private appConfig: AppConfig) {
  }

  create(data: IPIXCreationData): Observable<any> {
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_PIX),
      data
    ).pipe(
      map((resp: any) => {
      return resp;
      })
    );
  }

  get(params): Observable<any> {
    let paramshttp = new HttpParams()
      .set('', params);   
    return this.authUserHttp.put(
      this.getUrl(this.appConfig.API_PIX),
      paramshttp
    ).pipe(
      map((resp: any) => {
      return resp;
      })
    );
  }

  verifypix(store_id): Observable<any> {
    let paramshttp = new HttpParams()
      .set('store_id', store_id);   
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_VERIFYPIX),
      paramshttp
    ).pipe(
      map((resp: any) => {
      return resp;
      })
    );
  }

  getUrl(endpoint: string): string {
    return `${this.appConfig.SERVER_API}${endpoint}`;
  }

}
