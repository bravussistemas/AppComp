import { map } from 'rxjs/operators';
import { Moment } from 'moment';
import { DateService } from '../date-service';
import { EventService } from '../event.service';

export interface ICartDataTable {
  id?: number;
  day: Date | Moment | string;
  inventory_day_id: number;
  product_id: number;
  price: number;
  amount: number;
  next_batch: string;
}

export interface IOperationCart {
  inventory_day_id: number;
  amount: number;
}

export enum CartOperationsEnum {
  ADD,
  REMOVE,
  SET
}

export interface ProductInventoryDayDOT {
  id: number;
  day: string;
  inventory_day_id: number;
  product_id: number;
  amount: number;
}

export interface ICartInfo {
  countItems: number;
  totalToPay: number;
}

export interface CartManagerInterface {

  events: EventService;
  date: DateService

  init(): Promise<void>;

  get<T>(fields: string[], values: any[]): Promise<T>;

  getCartInfo(): Promise<ICartInfo>;

  getFuture(): Promise<any>;

  getMoreLateNextBach(): Promise<Date>;

  notifyCartChanged(auto: boolean);

  clearDay(day: Date | Moment, auto: boolean);

  insert(data: ICartDataTable, auto: boolean): Promise<any>;

  add(cartData: ICartDataTable, auto: boolean): Promise<any>;

  remove(cartData: ICartDataTable, auto: boolean): Promise<any>;

  deleteByInventoryDayId(inventoryDayId: number, auto: boolean);

  set(cartData: ICartDataTable, auto: boolean): Promise<any>;

  makeOperation(operation: CartOperationsEnum, cartData: ICartDataTable, auto: boolean): Promise<any>;

  clearNotInInventoryList(ids: any[], auto: boolean): Promise<any>;

  clear(auto: boolean);

  updateAmountByInventoryId(id: number, amount: number, auto: boolean);
}
