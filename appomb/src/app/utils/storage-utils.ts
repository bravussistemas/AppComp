import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable()
export class StorageUtils {

  constructor(private storage: Storage) {

  }

  getMultiple(keys: string[]): Promise<{ [key: string]: string }> {
    const promises = [];

    keys.forEach(key => promises.push(this.storage.get(key)));

    return Promise.all(promises).then(values => {
      const result = {};

      values.map((value, index) => {
        result[keys[index]] = value;
      });

      return result;
    });
  }
}