import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth-service';

@Injectable()
export class AuthUserHttp {

  constructor(private http: HttpClient,
              private storage: Storage) {
  }

  private getAuthHeaders(): Observable<HttpHeaders> {
    return from(this.storage.get(AuthService.TOKEN_NAME)).pipe(
      switchMap((token: string | null) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: token ? `Bearer ${token}` : '',
        });
        return of(headers); // Retorna um Observable<HttpHeaders>
      })
    );
  }

  get<T>(url: string, params?: HttpParams): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get(url, { headers, params });
      })
    );
  }

  post<T>(url: string, body: any, params?: HttpParams): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.post(url, body, { headers, params });
      })
    );
  }

  put<T>(url: string, body: any, params?: HttpParams): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.put(url, body, { headers, params });
      })
    );
  }

  delete<T>(url: string, params?: HttpParams): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.delete(url, { headers, params });
      })
    );
  }

}
