import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs';
import { map, Observable } from 'rxjs';
import { Product, ProductForEdit } from '../shared/models/product.model';
import { AuthUserHttp } from './auth-user-http';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ProductService {

  constructor(private auth: HttpClient, private authUserHttp: AuthUserHttp, private appConfig: AppConfig) {
  }

  list(params?): Observable<Product[]> {
    return this.authUserHttp.get(
      this.getUrl(this.appConfig.API_PRODUCT),
      params
    ).pipe(
      map((res: any) => {
      return <Product[]>res.results;
      })
    );
  }

  listForEdit(params?): Observable<ProductForEdit[]> {
    return this.authUserHttp.get(
      this.getUrl(this.appConfig.API_EDIT_PRODUCT_INVENTORY),
      params
    ).pipe(
      map((res: any) => {
      return <ProductForEdit[]>res.results;
      })
    );
  }

  listBreads() {
    return this.auth.get(this.getUrl(this.appConfig.API_BREADS_LIST)).pipe(
      map((res: any) => {
      return <Product[]>res;
      })
    );
  }

  getUrl(endpoint: string): string {
    return `${this.appConfig.SERVER_API}${endpoint}`;
  }

}
