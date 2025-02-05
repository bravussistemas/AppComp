import { Injectable, NgZone } from '@angular/core';
import { ILastRequest } from '../shared/interfaces';
import { Storage } from '@ionic/storage';

const LAST_REQUEST_KEY = 'LAST_REQUEST_KEY';

@Injectable()
export class LastRequestService {
  constructor(private storage: Storage, private zone: NgZone) {
  }

  private setSettings(settings: ILastRequest): Promise<any> {
    return this.storage.set(LAST_REQUEST_KEY, JSON.stringify(settings)).then(() => {
      return settings;
    });
  }

  updateSettings(settings: ILastRequest): Promise<any> {
    return this.getSettings().then((lastSettings) => {
      const newSettings = Object.assign({}, lastSettings, settings);
      console.log('Atualizando LastRequestService');
      console.log('de:');
      console.log(lastSettings);
      console.log('para:');
      console.log(newSettings);
      return this.setSettings(newSettings);
    });
  }

  getSettings(): Promise<ILastRequest> {
    return this.storage.get(LAST_REQUEST_KEY).then((val) => {
      if (!val) {
        return {};
      }
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error(e);
        return {};
      }
    });
  }

  static isValidSettings(settings: ILastRequest) {
    return settings && parseInt(<any>settings.storeId) > 0 && settings.title && parseInt(<any>settings.cityId) > 0 && parseInt(<any>settings.storeType) >= 0;
  }

}
