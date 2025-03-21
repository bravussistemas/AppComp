import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs';
import { HttpClient } from '@angular/common/http';
import { CachedServiceBase } from '../shared/cached-service-base';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject, Observable } from 'rxjs';
import { StdImage } from '../shared/interfaces';
import { map } from 'rxjs/operators';


export interface IAppConfig {
  id: number;
  config_name: string;
  choose_category_store_bg: StdImage;
  choose_category_store_bg_title: string;
  choose_category_store_bg_subtitle: string;
  choose_store_bg: StdImage;
  active: boolean;
  user_can_choose_delivery_hour: boolean;
}

interface AppConfigResponse {
  data: IAppConfig;
}

interface IBuildConfig {
  packageName: string;
  basePackageName: string;
  displayName: string;
  name: string;
  version: string;
  versionCode: number;
  debug: boolean;
  buildDate: string;
  installDate: string;
  buildType: string;
  flavor: string;
}

@Injectable()
export class AppConfigService extends CachedServiceBase {
  getActive$ = new BehaviorSubject<IAppConfig>(null);
  buildConfig$ = new BehaviorSubject<IBuildConfig>(null);

  constructor(private http: HttpClient, private appConfig: AppConfig, public override cache: CacheService) {
    super('AppConfigService', cache);
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  }

  onDeviceReady() {
    let BuildInfo = (<any>window).BuildInfo;
    this.buildConfig$.next(BuildInfo);
  }

  getActive(): Observable<AppConfigResponse> {
    const url = this.getUrl(this.appConfig.API_GET_APP_CONFIG);
    const key = url;
    const request = this.http.get(url);
  
    return this.cacheRequest(key, request, 60 * 3).pipe(
      map((res: any) => {
        const result = <AppConfigResponse>res;
        if (result) {
          this.getActive$.next(result.data);
        }
        return result;
      })
    );
  }

  getUrl(endpoint: string): string {  
    return `${this.appConfig.SERVER_API}${endpoint}`;
    
  }

}
