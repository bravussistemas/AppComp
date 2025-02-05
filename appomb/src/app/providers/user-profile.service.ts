import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { AppConfig } from "../../configs";
import { AuthUserHttp } from "./auth-user-http";
import { Observable } from "rxjs";
import { IUserProfile } from "../shared/interfaces";

@Injectable()
export class UserProfileService {

  constructor(private authUserHttp: AuthUserHttp,
              private appConfig: AppConfig) {
  }

  edit(data: IUserProfile): Observable<any> {
    return this.authUserHttp.post(this.getUrl(), data);
  }

  getUrl(): string {
    return `${this.appConfig.SERVER_API}${this.appConfig.API_EDIT_USER_PROFILE}`;
  }

}
