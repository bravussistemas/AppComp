import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateService } from '../date-service';
import {
  CartManagerInterface,
  CartOperationsEnum,
  ICartDataTable,
  ICartInfo,
  IOperationCart
} from './cart-manager-interface';
import * as moment from 'moment';
import { EventService } from '../event.service';

@Injectable()
export abstract class AbstractCartManager implements CartManagerInterface {

  public events: EventService;
  public date: DateService;

  async getCartInfo(): Promise<ICartInfo> {
    let units = 0, total = 0;
    const result = await this.getFuture();
    if (result) {
      if (result && result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          let row = result[i];
          if (row && row.amount) {
            units += row.amount;
            total += row.amount * (row.price || 0);
          }
        }
      }
    }
    return <ICartInfo>{countItems: units, totalToPay: total};
  }

  async getMoreLateNextBach(): Promise<Date> {
    let date = null;
    const result = await this.getFuture();
    if (result) {
      if (result && result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          let row = result[i];
          if (row && row.next_batch) {
            const nextBatch = moment(row.next_batch).toDate();
            if (!date || nextBatch > date) {
              date = nextBatch;
            }
          }
        }
      }
    }
    return date;
  }

  protected abstract performGetFuture(): Promise<ICartDataTable[]>;

  getFuture(): Promise<any> {
    return this.performGetFuture().then((result) => {
      return result;
    }).catch((e) => {
      console.warn('Can\'t get future data of chart with error:');
      console.error(e);
    });
  }

  notifyCartChanged(auto = false) {
    this.events.emitEvent('cartChanged', {auto: auto});
  }

  protected abstract performClearDay(day: Date | string | moment.Moment, auto: boolean): Promise<boolean>;

  clearDay(day: Date | moment.Moment, auto = false) {
    return this.performClearDay(day, auto)
      .then((updated) => {
        this.notifyCartChanged(auto);
        return updated;
      });
  }

  protected abstract performInsert(data: ICartDataTable, auto: boolean): Promise<boolean>;

  insert(data: ICartDataTable, auto = false): Promise<boolean> {
    return this.performInsert(data, auto)
      .then((result) => {
        this.notifyCartChanged(auto);
        return result;
      })
  }

  protected abstract performUpdate(data: ICartDataTable, auto: boolean): Promise<boolean>;

  update(data: ICartDataTable, auto = false): Promise<boolean> {
    return this.performUpdate(data, auto)
      .then((result) => {
        this.notifyCartChanged(auto);
        return result;
      })
  }

  protected abstract performUpdateAmount(data: IOperationCart, auto: boolean): Promise<boolean>;

  updateAmount(data: IOperationCart, auto = false): Promise<boolean> {
    return this.performUpdateAmount(data, auto)
      .then((result) => {
        this.notifyCartChanged(auto);
        return result;
      })
  }

  add(cartData: ICartDataTable, auto = false): Promise<any> {
    return this.makeOperation(CartOperationsEnum.ADD, cartData, auto);
  }

  remove(cartData: ICartDataTable, auto = false): Promise<any> {
    return this.makeOperation(CartOperationsEnum.REMOVE, cartData, auto);
  }

  protected abstract performDeleteByInventoryDayId(inventoryDayId: number, auto: boolean): Promise<boolean>;

  deleteByInventoryDayId(inventoryDayId: number, auto = false) {
    if (!inventoryDayId) {
      throw new Error('You must pass a inventory day ID');
    }
    return this.performDeleteByInventoryDayId(inventoryDayId, auto)
      .then((updated) => {
        this.notifyCartChanged(auto);
        return updated;
      });
  }

  set(cartData: ICartDataTable, auto = false): Promise<any> {
    return this.makeOperation(CartOperationsEnum.SET, cartData, auto);
  }

  protected abstract performGetByInventoryDayId(inventoryDayId: number): Promise<ICartDataTable>;

  getByInventoryDayId(inventoryDayId: number): Promise<ICartDataTable> {
    if (!inventoryDayId) {
      throw new Error('You must pass a inventory day ID');
    }
    return this.performGetByInventoryDayId(inventoryDayId);
  }

  makeOperation(operation: CartOperationsEnum, cartData: ICartDataTable, auto = false): Promise<any> {
    return this.getByInventoryDayId(cartData.inventory_day_id).then((data) => {
      if (data) {
        // row already exists, increment
        switch (operation) {
          case CartOperationsEnum.REMOVE:
            cartData.amount = data.amount - cartData.amount;
            break;
          case CartOperationsEnum.ADD:
            cartData.amount = data.amount + cartData.amount;
            break;
        }
        if (cartData.amount <= 0) {
          return this.deleteByInventoryDayId(cartData.inventory_day_id, auto);
        }
        return this.updateAmount({
          inventory_day_id: cartData.inventory_day_id,
          amount: cartData.amount,
        });
      }
      // row not exists yet, create
      return this.insert(cartData, auto).catch(e => console.error(e));
    });
  }

  abstract filterByInventoryIds(ids: any[]): Promise<ICartDataTable[]>;

  protected abstract performClearNotInInventoryList(ids: any[], auto: boolean): Promise<any>;

  clearNotInInventoryList(ids: number[], auto = false): Promise<any> {
    if (ids && ids.length) {
      return this.performClearNotInInventoryList(ids, auto)
        .then(() => {
          this.notifyCartChanged(auto);
        });
    } else {
      return this.clear(auto);
    }
  }

  protected abstract performClear(): Promise<void>;

  clear(auto = false) {
    return this.performClear()
      .then(() => {
        this.notifyCartChanged(auto);
      });
  }

  updateAmountByInventoryId(id: number, amount: number, auto = false) {
    if (amount <= 0) {
      return this.deleteByInventoryDayId(id, auto);
    }
    return this.updateAmount({
      inventory_day_id: id,
      amount: amount,
    });
  }

  protected abstract performGet<T>(fields: string[], values: any[]): Promise<T>;

  get<T>(fields: string[], values: any[]): Promise<T> {
    return this.performGet(fields, values);
  }

  abstract init(): Promise<void>;

}
