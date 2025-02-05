import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Storage } from "@ionic/storage";

const CART_STORAGE_KEY = 'cart_manager_storage_v1';

export interface ICartStorage {
  [key: number]: IAmountOptions;
}

export interface ICartInfo {
  countItems: number;
  totalToPay: number;
}

export interface IAmountOptions {
  productId: number;
  amount: number;
  price: number;
  max: number;
}

export class ErrorCardManager {
  error: string;

  constructor(error?: string) {
    this.error = error;
  }
}

export class MaxAmountExceedError extends ErrorCardManager {

}

@Injectable()

export class CartManager {

  constructor(private storage: Storage) {
  }

  getCartStorage(): Promise<ICartStorage> {
    return new Promise((resolve, reject) => {
      this.storage.get(CART_STORAGE_KEY).then((cartStorage: string) => {
        resolve(JSON.parse(cartStorage || '{}'));
      }).catch((error) => reject(error));
    });
  }

  getCartInfo(): Promise<ICartInfo> {
    return new Promise((resolve, reject) => {
      let units = 0,
        total = 0;
      this.getCartStorage().then((cartStorage: ICartStorage) => {
        for (let key in cartStorage) {
          units += cartStorage[key].amount;
          total += cartStorage[key].amount * cartStorage[key].price;
        }
        resolve(<ICartInfo>{countItems: units, totalToPay: total})
      }).catch((e) => reject(e));
    });
  }

  executeOperation(operation: 'add' | 'remove' | 'set', options: IAmountOptions): Promise<IAmountOptions> {
    return new Promise((resolve, reject) => {
      this.getCartStorage().then((cartStorage: ICartStorage) => {
        let currentAmount = 0;
        if (cartStorage[options.productId]) {
          currentAmount = cartStorage[options.productId].amount;
        }
        options.amount = CartManager.calcAmount(operation, currentAmount, options.amount);

        if (options.amount > options.max) {
          reject(new MaxAmountExceedError());
        } else {
          cartStorage[options.productId] = options;
          this.storage.set(CART_STORAGE_KEY, JSON.stringify(cartStorage)).then(() => {
            resolve(cartStorage[options.productId]);
          }).catch(reject.bind(this));
        }

      }).catch(reject.bind(this));
    });
  }

  setAmount(options: IAmountOptions): Promise<IAmountOptions> {
    return this.executeOperation('set', options);
  }

  add(options: IAmountOptions): Promise<IAmountOptions> {
    return this.executeOperation('add', options);
  }

  remove(options: IAmountOptions): Promise<IAmountOptions> {
    return this.executeOperation('remove', options);
  }

  get(productId: number): Promise<IAmountOptions> {
    return new Promise((resolve, reject) => {
      this.getCartStorage().then((cartStorage: ICartStorage) => {
        resolve(cartStorage[productId]);
      }).catch(reject.bind(this));
    })
  }

  static calcAmount(operation: 'add' | 'remove' | 'set', val1, val2) {
    switch (operation) {
      case 'add':
        return Math.max(val1 + val2, 0);
      case 'remove':
        return Math.max(val1 - val2, 0);
      case 'set':
        return Math.max(val2, 0);
    }
  }

  clean(): Promise<any> {
    return this.storage.remove(CART_STORAGE_KEY);
  }
}
