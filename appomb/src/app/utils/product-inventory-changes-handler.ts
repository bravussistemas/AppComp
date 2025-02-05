import { CartManagerTable } from '../providers/database/cart-manager-table';
import * as Raven from 'raven-js';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductInventoryChangesHandler {
  private response;

  constructor(private cartManagerTable: CartManagerTable) {

  }

  private extractIds(): number[] {
    return this.response.map((val) => {
      return val.id;
    });
  }

  private extractItems(): { [key: number]: number } {
    let items = {};
    for (let i = 0; i < this.response.length; i++) {
      let item = this.response[i];
      items[item.id] = item.amount;
    }
    return items;
  }

  private deleteFromCart(row) {
    this.cartManagerTable
      .deleteByInventoryDayId(row.inventory_day_id, true)
      .catch(this.handleError.bind(this));
  }

  private updateAmount(row, items) {
    this.cartManagerTable
      .updateAmountByInventoryId(row.inventory_day_id, items[row.inventory_day_id], true)
      .catch(this.handleError.bind(this));
  }

  handle(response) {
    this.response = response;
    this.cartManagerTable.init().then(() => {

      let ids = this.extractIds(),
        items = this.extractItems();

      this.cartManagerTable.clearNotInInventoryList(ids, true)
        .catch(this.handleError.bind(this));

      this.cartManagerTable.filterByInventoryIds(ids)
        .then((rows) => {
          for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (!items[row.inventory_day_id]) {
              // item not have amount in stock, delete from cart
              this.deleteFromCart(row);
            } else if (items[row.inventory_day_id] < row.amount) {
              // local cart have more than server stock, remove from local
              this.updateAmount(row, items);
            }
          }
        });
    });
  }

  handleError(e) {
    console.error(e);
    Raven.captureException(e);
  }
}