import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateService } from '../date-service';
import { ICartDataTable, IOperationCart } from './cart-manager-interface';
import { AbstractCartManager } from './abstract-cart-manager';
import * as Raven from 'raven-js';
import { Utils } from '../../utils/utils';
import * as moment from 'moment';
import { EventService } from '../event.service';

export interface ICartDataMemory extends ICartDataTable {
  day: string;
}

function toInt(value: any) {
  if (value === undefined || value === null) return NaN;
  return parseInt(value.toString(), 10);
}

function toIntList(values: any[]) {
  return (values || []).map((item) => toInt(item)).filter((v) => !isNaN(v));
}

@Injectable()
export class CartManagerMemory extends AbstractCartManager {
  _storage: ICartDataMemory[] = [];

  constructor(
    public override events: EventService,
    public override date: DateService
  ) {
    super();
  }

  filterByInventoryIds(ids: any[]): Promise<ICartDataMemory[]> {
    const result = this._storage.filter((item) => {
      return toIntList(ids).indexOf(toInt(item.inventory_day_id)) !== -1;
    });
    return Promise.resolve(result);
  }

  protected performClear(): Promise<void> {
    this._storage = [];
    return Promise.resolve();
  }

  protected performClearDay(day: Date, auto: boolean): Promise<boolean> {
    let success = true;
    try {
      this._storage = this._storage.filter((item) => {
        return !moment(item.day).isSame(day, 'date');
      });
    } catch (e) {
      Raven.captureException(e);
      console.error(e);
      success = false;
    }
    return Promise.resolve(success);
  }

  protected performClearNotInInventoryList(
    ids: number[],
    auto: boolean
  ): Promise<any> {
    let success = true;
    try {
      this._storage = this._storage.filter((item) => {
        return toIntList(ids).indexOf(toInt(item.inventory_day_id)) > -1;
      });
    } catch (e) {
      Raven.captureException(e);
      console.error(e);
      success = false;
    }
    return Promise.resolve(success);
  }

  protected performDeleteByInventoryDayId(
    inventoryDayId: number | string,
    auto: boolean
  ): Promise<boolean> {
    let success = true;
    try {
      for (let i = 0; i < this._storage.length; i++) {
        const item = this._storage[i];
        if (toInt(item.inventory_day_id) === toInt(inventoryDayId)) {
          this._storage.splice(i, 1);
          return Promise.resolve(true);
        }
      }
    } catch (e) {
      Raven.captureException(e);
      console.error(e);
      success = false;
    }
    return Promise.resolve(success);
  }

  protected performGetByInventoryDayId(
    inventoryDayId: number
  ): Promise<ICartDataMemory> {
    try {
      for (let i = 0; i < this._storage.length; i++) {
        const item = this._storage[i];
        if (toInt(item.inventory_day_id) === toInt(inventoryDayId)) {
          return Promise.resolve(item);
        }
      }
    } catch (e) {
      Raven.captureException(e);
      console.error(e);
    }
    return Promise.resolve(null);
  }

  protected performGetFuture(): Promise<ICartDataMemory[]> {
    const result = this._storage.filter((item) => {
      return moment(item.day).isSameOrAfter(this.date.today(), 'date');
    });
    return Promise.resolve(result);
  }

  protected async performInsert(
    data: ICartDataMemory,
    auto: boolean
  ): Promise<boolean> {
    data.day = Utils.toSqliteDate(data.day); // normalize utils that excepts string date as return
    let exists = await this.getByInventoryDayId(data.inventory_day_id);
    if (exists) {
      throw new Error('Already exists item.');
    }
    this._storage.push(data);
    return Promise.resolve(true);
  }

  protected performUpdate(
    data: ICartDataMemory,
    auto: boolean
  ): Promise<boolean> {
    let success = false;
    try {
      for (let i = 0; i < this._storage.length; i++) {
        const item = this._storage[i];

        if (toInt(item.inventory_day_id) === toInt(data.inventory_day_id)) {
          const edited = item;

          edited.day = data.day || item.day;

          if (!Utils.isNullOrUndefined(data.amount)) {
            edited.amount = data.amount;
          }

          if (!Utils.isNullOrUndefined(data.price)) {
            edited.price = data.price;
          }

          this._storage[i] = edited;

          return Promise.resolve(true);
        }
      }
    } catch (e) {
      Raven.captureException(e);
      console.error(e);
    }
    return Promise.resolve(success);
  }

  protected performUpdateAmount(
    data: IOperationCart,
    auto: boolean
  ): Promise<boolean> {
    let success = false;
    try {
      for (let i = 0; i < this._storage.length; i++) {
        const item = this._storage[i];
        if (toInt(item.inventory_day_id) === toInt(data.inventory_day_id)) {
          const edited = item;
          if (!Utils.isNullOrUndefined(data.amount)) {
            edited.amount = data.amount;
          }
          this._storage[i] = edited;
          return Promise.resolve(true);
        }
      }
    } catch (e) {
      Raven.captureException(e);
      console.error(e);
    }
    return Promise.resolve(success);
  }

  init(): Promise<void> {
    return Promise.resolve();
  }

  protected performGet<T>(fields: string[], values: any[]): Promise<T> {
    return undefined;
  }
}
