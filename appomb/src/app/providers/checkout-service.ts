import { Injectable } from "@angular/core";
import { AppConfig } from "../../configs";
import { AuthUserHttp } from "./auth-user-http";
import { ProductInventoryDay } from "../shared/models/product-inventory-day.model";
import { Observable } from "rxjs";
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface DayInventory {
  [key: string]: ProductInventoryDay[];
}

@Injectable()
export class CheckoutService {

  constructor(private authUserHttp: AuthUserHttp, private appConfig: AppConfig) {
  }

  getByIds(ids: any[], storeId: number): Observable<any> {
    const params = new HttpParams()
      .set('ids', ids.join(',')) // Concatena os IDs como string separada por vírgulas
      .set('store_id', storeId.toString()); // Define o ID da loja
  
    return this.authUserHttp.get(this.getUrl() + this.appConfig.API_CHECKOUT_LIST, params 
    ).pipe(
      map((res: any) => res) // Retorna diretamente a resposta
    );
  } 

  getUrl(): string {
    return `${this.appConfig.SERVER_API}`;
  }

}
