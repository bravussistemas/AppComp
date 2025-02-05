import { Injectable } from "@angular/core";
import { AppConfig } from "../../configs";
import { AuthUserHttp } from "./auth-user-http";
import { ProductInventoryDay } from "../shared/models/product-inventory-day.model";
import { map, Observable } from "rxjs";
import { Moment } from "moment";
import { HttpUtils } from "../utils/http-utils";
import { HttpParams } from "@angular/common/http";

export interface ProductOutputData {
  product: number;
  store: number;
  amount: number;
  day_ref: string;
  movement_type?: number;
}

const INPUT = 1;
const OUTPUT = 2;

@Injectable()
export class ProductInventory {

  constructor(private authUserHttp: AuthUserHttp, private appConfig: AppConfig) {
  }

  getDay(day: Moment, data?: any): Observable<ProductInventoryDay[]> {
    let params = new HttpParams()
      .set('start_date', HttpUtils.dateToUrl(day))
      .set('end_date', HttpUtils.dateToUrl(day));

    Object.assign(params, data);
    return this.authUserHttp.get(
      this.getUrl(this.appConfig.API_PRODUCT_INVENTORY),
      params
    ).pipe(
      map((res: any) => {
        return <ProductInventoryDay[]>res.json().results;
      })
    );
  }

  addOrRemoveInventory(operationType: number, data: ProductOutputData): Observable<any> {
    data.movement_type = operationType;
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_ADD_PRODUCT_OUTPUT),
      data
    ).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  changeVisibility(id: number, isVisible: boolean): Observable<any> {
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_CHANGE_INVENTORY_VISIBILITY),
      {
        product_inventory: id,
        is_visible: isVisible
      }
    ).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  changeNextBatch(id: number, nextBatch: Date): Observable<any> {
    console.log('nextBatch.toJSON()');
    console.log(nextBatch.toJSON());
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_CHANGE_INVENTORY_NEXT_BATCH),
      {
        product_inventory: id,
        next_batch: nextBatch.toJSON()
      }
    ).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  editProductsOnDay(data: any): Observable<any> {
    return this.authUserHttp.post(
      this.getUrl(this.appConfig.API_EDIT_PRODUCTS_ON_DAY),
      data
    );
  }

  addProductInventory(data: ProductOutputData): Observable<any> {
    return this.addOrRemoveInventory(INPUT, data);
  }

  removeProductInventory(data: ProductOutputData): Observable<any> {
    return this.addOrRemoveInventory(OUTPUT, data);
  }

  getUrl(endpoint: string): string {
    return `${this.appConfig.SERVER_API}${endpoint}`;
  }

}
