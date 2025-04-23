import { Injectable, Injector } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpProviderBase } from '../http-provider-base';
import { AppConfig } from '../../../configs';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Utils } from '../../utils/utils';

export interface ICepInfo {
  cep: string;
  street: string;
  district: string;
  city: string;
  state: string;
  provider: string;
}

export interface ISearchAddressDO {
  query: string;
  lat?: number;
  lng?: number;
  city: string;
}

export interface ISearchAddressResultDO {
  name: string;
  id: string;
  description: string;
  source: number;
  type: string;
}

export interface IGetPlaceInfoDO {
  place_id: string;
  source: number;
}

export interface IPlaceInfoDO {
  id: number;
  name: string;
  number: number;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: number;
  latitude: number;
  longitude: number;
  type: string;
}

export interface State {
  id: number;
  name: string;
  abbr: string;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
}

export interface District {
  id: number;
  name: string;
  city_id: number;
}

@Injectable()
export class GeoServiceProvider extends HttpProviderBase {
  constructor(injector: Injector, private appConfig: AppConfig) {
    super(injector);
  }

  searchCep(cep: string): Observable<ICepInfo> {
    const url = this.buildUrl({ path: this.appConfig.API_SEARCH_CEP });
    const params = new HttpParams().set('cep', cep);

    return this.client.get<ICepInfo>(url, params).pipe(
      map((resp: any) => resp?.data || null),
      catchError((e) => this.handlerHttpError(e))
    );
  }

  searchByAddress(data: ISearchAddressDO): Observable<ISearchAddressResultDO[]> {
    const url = this.buildUrl({ path: this.appConfig.API_SEARCH_ADDRESS });
    const params = new HttpParams({ fromObject: { ...data } });

    return this.client.get<ISearchAddressResultDO[]>(url, params).pipe(
      map(Utils.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }

  getPlaceInfo(data: IGetPlaceInfoDO): Observable<IPlaceInfoDO> {
    const url = this.buildUrl({ path: this.appConfig.API_PLACE_INFO });
    const params = new HttpParams({ fromObject: { ...data } });

    return this.client.get<IPlaceInfoDO>(url, params).pipe(
      map(Utils.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }

  getStates(): Observable<State[]> {
    const url = this.buildUrl({ path: this.appConfig.API_STATES });

    return this.client.get<State[]>(url).pipe(
      map(Utils.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }

  getCities(stateId: number): Observable<City[]> {
    const url = this.buildUrl({ path: this.appConfig.API_CITIES });
    const params = new HttpParams().set('state_id', stateId.toString());
    
    return this.client.get<City[]>(url,  params).pipe(
      map(Utils.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }

  getDistricts(cityId: number): Observable<District[]> {
    const url = this.buildUrl({ path: this.appConfig.API_DISTRICTS });
    const params = new HttpParams().set('city_id', cityId.toString());

    return this.client.get<District[]>(url,  params).pipe(
      map(Utils.mapToJson),
      catchError((e) => this.handlerHttpError(e))
    );
  }
}
