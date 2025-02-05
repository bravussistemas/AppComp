import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeliveryMethod } from '../../shared/interfaces';
import { Store } from '../../shared/models/store.model';
import { Address } from '../../shared/models/address.model';
import { DeliveryHourSimple } from '../user-address/user-address';

export interface DeliveryStateData {
  store: Store;
  address: Address;
  method: DeliveryMethod;
  hour: DeliveryHourSimple;
}

@Injectable()
export class DeliveryState {
  private _deliveryAddress: Address = null;
  readonly deliveryAddress$ = new BehaviorSubject<Address>(this._deliveryAddress);

  private _deliveryMethod: DeliveryMethod = null;
  readonly deliveryMethod$ = new BehaviorSubject<DeliveryMethod>(this._deliveryMethod);

  private _deliveryHour: DeliveryHourSimple = null;
  readonly deliveryHour$ = new BehaviorSubject<DeliveryHourSimple>(this._deliveryHour);

  private _store: Store = <any>{};
  readonly store$ = new BehaviorSubject<Store>(this._store);

  private _state: DeliveryStateData = <any>{};
  readonly state$ = new BehaviorSubject<DeliveryStateData>(this._state);

  constructor(
    // private storage: Storage,
  ) {
    // this.storage.get('DELIVERY_STATE').then((data) => {
    //   if (!data) {
    //     return;
    //   }
    //   const dataJSON = JSON.parse(data);
    //   this._store = dataJSON.store;
    //   this._deliveryAddress = dataJSON.address;
    //   this._deliveryMethod = dataJSON.method;
    //   this._deliveryHour = dataJSON.hour;
    //   this.store$.next(dataJSON.store);
    //   this.deliveryAddress$.next(dataJSON.address);
    //   this.deliveryMethod$.next(dataJSON.method);
    //   this.deliveryHour$.next(dataJSON.hour);
    //   this.dispatchState('all');
    // });
  }

  clearState() {
    this._store = null;
    this._deliveryAddress = null;
    this._deliveryMethod = null;
    this._deliveryHour = null;
    this.store$.next(null);
    this.deliveryAddress$.next(null);
    this.deliveryMethod$.next(null);
    this.deliveryHour$.next(null);
    this.dispatchState('all');
  }

  get deliveryAddress(): Address {
    return this._deliveryAddress;
  }

  set deliveryAddress(value: Address) {
    this._deliveryAddress = value;
    this.deliveryAddress$.next(value);
    this.dispatchState('deliveryAddress');
  }

  get deliveryMethod(): DeliveryMethod {
    return this._deliveryMethod;
  }

  set deliveryMethod(value: DeliveryMethod) {
    this._deliveryMethod = value;
    this.deliveryMethod$.next(value);
    this.dispatchState('deliveryMethod');
  }

  get deliveryHour(): DeliveryHourSimple {
    return this._deliveryHour;
  }

  set deliveryHour(value: DeliveryHourSimple) {
    this._deliveryHour = value;
    this.deliveryHour$.next(value);
    this.dispatchState('deliveryHour');
  }

  get store(): Store {
    return this._store;
  }

  set store(value: Store) {
    this._store = value;
    this.store$.next(value);
    this.dispatchState('store');
  }

  private dispatchState(from: string) {
    const data = this._state;
    if (from == 'deliveryAddress' || from == 'all') {
      data.address = this._deliveryAddress;
    }
    if (from == 'store' || from == 'all') {
      data.store = this._store;
    }
    if (from == 'deliveryMethod' || from == 'all') {
      data.method = this._deliveryMethod;
    }
    if (from == 'deliveryHour' || from == 'all') {
      data.hour = this._deliveryHour;
    }
    this.state$.next(data);
  }
}
