import { Injectable } from '@angular/core';
import { AppConfig } from '../../configs';
import { AuthUserHttp } from './auth-user-http';
import { map, Observable } from 'rxjs';
import { Moment } from 'moment';
import { HttpUtils } from '../utils/http-utils';
import { OperatingDaysNote } from '../shared/models/operating-day-note.model';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppConfigService } from './app-config.service';
import { HttpParams } from '@angular/common/http';

export interface ICreateNoteData {
  store: number;
  day: string;
  repeat_period: number;
  message: string;
  note_type: number;
  url_image?: string;
  app_version_to_update?: string;
  show_unique?: boolean;
  is_app_update_notice?: boolean;
  title?: string;
}

export enum NoteTypeEnum {
  NORMAL = 0,
  WARNING = 1,
  SUBTITLE = 2,
}

@Injectable()
export class OperatingDaysNoteService {
  deviceId: string;
  noteShowedList = [];

  constructor(private authUserHttp: AuthUserHttp,
              private appConfig: AppConfig,
              private appConfigService: AppConfigService,
              private storage: Storage,
              private platform: Platform,
            ) {
                this.initializeDeviceId();
              }
            
  private async initializeDeviceId() {
    if (this.platform.is('hybrid')) {
      const info = await Device.getId();
      this.deviceId = info.identifier;
    } else if (this.appConfig.DEBUG) {
      this.deviceId = '60884a0e-1d57-426d-9efb-ec0a5efe221a'; // Valor para depuração
    }
  }

  saveAsShowed(note: OperatingDaysNote) {
    this.noteShowedList.push(note.id);
  }

  noteIsShowed(note: OperatingDaysNote) {
    return this.noteShowedList.indexOf(note.id) !== -1;
  }

  mustShowNote(note: OperatingDaysNote) {
    if (!note || this.noteIsShowed(note)) return false;
    const normalize = (v) => {
      v = v.toString();
      if (v.length === 1) {
        return '0' + v;
      }
      return v;
    };
    if (note.is_app_update_notice) {
      if (!note.app_version_to_update) return false;
      const buildInfo = this.appConfigService.buildConfig$.getValue();
      if (!buildInfo) return false;
      const parts = note.app_version_to_update.split('.');
      const versionNumber = parseInt(parts[0] + normalize(parts[1]) + normalize(parts[2]));
      if (!versionNumber) return false;
      if (buildInfo.versionCode >= versionNumber) return false;
    }
    return true;
  }
  
  getDay(storeId: number, day: Moment, ignoreUniqueSee = false, onlyVisible = true): Observable<OperatingDaysNote[]> {
    let params = new HttpParams()
      .set('day', HttpUtils.dateToUrl(day))
      .set('store_id', storeId.toString())
      .set('device_id', this.deviceId)
      .set('ignore_unique_see', ignoreUniqueSee.toString())
      .set('only_visible', onlyVisible.toString())
      .set('fix_modal_appear', 'true');
  
    return this.authUserHttp.get<OperatingDaysNote[]>(this.getUrl(this.appConfig.API_LIST_NOTES_DAY), params).pipe(
      map((res: any) => res as OperatingDaysNote[])
    );
  }

  create(data: ICreateNoteData): Observable<any> {
    return this.authUserHttp.post(
      this.getUrl(),
      data
    );
  }

  delete(id: number): Observable<any> {    
    let params = new HttpParams()
    .set('id', id);
    return this.authUserHttp.delete(
      this.getUrl(),
      params
    );
  }

  setActive(id: number): Observable<any> {
    return this.authUserHttp.post(
      `${this.appConfig.SERVER_API}${this.appConfig.API_SET_OPERATING_NOTE_ACTIVE}`,
      {
        id: id
      }
    );
  }

  getUrl(path = this.appConfig.API_NOTES_DAY): string {
    return `${this.appConfig.SERVER_API}${path}`;
  }

}
