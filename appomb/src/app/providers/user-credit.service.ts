import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs';
import { AuthUserHttp } from './auth-user-http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root', // Prover o serviço globalmente
})
export class UserCreditService {
  constructor(
    private authUserHttp: AuthUserHttp,
    private appConfig: AppConfig
  ) {}

  list(page: number, limit: number, search: string): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString())
      .set('search', search);

    return this.authUserHttp.get(this.getUrl(this.appConfig.API_LIST_USERS_ADD_CREDIT),  params );
  }

  detailUserCredits(userId: number): Observable<any> {
    const params = new HttpParams().set('user_id', userId.toString());

    return this.authUserHttp.get(this.getUrl(this.appConfig.API_DETAIL_USER_CREDITS),  params );
  }

  addCredit(data: { userId: number; amount: any; storeId: number }): Observable<any> {
    return this.authUserHttp.post(this.getUrl(this.appConfig.API_ADD_CREDIT), {
      user: data.userId,
      amount: data.amount,
      store: data.storeId,
    });
  }

  remove(data: { userId: number; creditId: any }): Observable<any> {
    const params = new HttpParams()
      .set('user_id', data.userId.toString())
      .set('credit_id', data.creditId.toString());

    return this.authUserHttp.delete(this.getUrl(this.appConfig.API_REMOVE_CREDIT),  params );
  }

  getMyBalance(): Observable<{ balance: number }> {
    return this.authUserHttp
      .get<{ balance: number }>(this.getUrl(this.appConfig.API_BALANCE_CREDIT))
      .pipe(map((resp) => resp)); // O `resp` já é tipado como JSON
  }

  private getUrl(url: string): string {
    return `${this.appConfig.SERVER_API}${url}`;
  }
}
