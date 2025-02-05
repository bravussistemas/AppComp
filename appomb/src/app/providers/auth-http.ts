import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfig } from "../../configs";

@Injectable()
export class AuthHttp {

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': this.appConfig.HEADER_BASIC_AUTH
    });
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.createAuthorizationHeader()
    });
  }

  post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data, {
      headers: this.createAuthorizationHeader()
    });
  }
}
