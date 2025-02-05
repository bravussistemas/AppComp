import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductInventoryDay } from '../../shared/models/product-inventory-day.model';
import { AlertHelper } from '../../utils/alert-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { CartManagerTable } from '../../providers/database/cart-manager-table';
import { NavController } from '@ionic/angular';
import * as Raven from 'raven-js';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../utils/utils';
import { CartOperationsEnum } from '../../providers/database/cart-manager-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'item-cart-amount',
  templateUrl: 'item-cart-amount.html'
})
export class ItemCartAmount implements OnInit {
  _item: ProductInventoryDay;
  @Input('enableAdminView') enableAdminView = false;

  get item(): ProductInventoryDay {
    return this._item;
  }

  @Input('item')
  set item(val: ProductInventoryDay) {
    this._item = val;
    this.resellerId = Utils.safeAttr(this._item, 'reseller.id');
    this.update();
  };

  maxAmount: number;

  loading = false;

  amount: number;
  total: number;
  resellerId: number;

  @Output() onChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private cartManagerTable: CartManagerTable,
              private navCtrl: NavController,
              private trans: TranslateService,
              private toastHelper: ToastHelper,
              private alertHelper: AlertHelper,
              private router: Router,) {
  }

  ngOnInit() {
  }

  private changeCartAmount(operation: CartOperationsEnum, amount: number) {
    this.loading = true;
    this.cartManagerTable.makeOperation(operation, {
      day: this.item.day,
      inventory_day_id: this.item.id,
      product_id: this.item.product.id,
      amount: amount,
      price: this.item.product.price,
      next_batch: this.item.next_batch,
    }).then(() => {
      this.loading = false;
      let newAmount = this.amount;
      if (operation == CartOperationsEnum.ADD) {
        newAmount += amount;
      }
      if (operation == CartOperationsEnum.REMOVE) {
        newAmount -= amount;
      }
      if (operation == CartOperationsEnum.SET) {
        newAmount = amount;
      }
      this.onChange.emit(newAmount);
      this.update();
    }).catch((error) => {
      this.handlerError(error);
    });
  }

  addAmount() {
    this.changeCartAmount(CartOperationsEnum.ADD, 1);
  }

  removeAmount() {
    this.changeCartAmount(CartOperationsEnum.REMOVE, 1);
  }

  setAmount(amount: any) {
    amount = parseInt(amount, 10);
    if (amount < 0) {
      this.loading = false;
      this.trans.get('INSERT_POSITIVE_VALUE').subscribe((val) => {
        this.toastHelper.show({message: val, position: 'middle', cssClass: 'toast-custom-white'});
      });
      return;
    }
    this.changeCartAmount(CartOperationsEnum.SET, amount);
  }

  update() {
    if (this.item) {
      this.updateMaxAmount();
      this.loading = true;
      this.cartManagerTable.getByInventoryDayId(this.item.id)
        .then((data) => {
          // without data yet
          this.loading = false;
          if (!data) {
            return this.reset();  // this return avoid recursive
          }
          // requested amount greater than permitted
          if (data.amount > this.maxAmount) {
            return this.onRequestedAmountGreater();
          }
          // set buy resume in view
          this.updateBuyResumeInView(data.amount);
        });
    }
  }

  onRequestedAmountGreater() {
    this.setAmount(this.maxAmount);
    let msg = `O valor máximo para este produto nesse dia é de ${this.maxAmount}`;
    if (this.item.product && this.item.product.name) {
      msg = `O valor máximo produto ${this.item.product.name} nesse dia é de ${this.maxAmount}`;
    }
    this.toastHelper.show({message: msg});
    this.loading = false;
    return;
  }

  updateBuyResumeInView(currentQtd: number = 0) {
    try {
      this.amount = currentQtd;
      this.total = currentQtd * this.item.product.price;
    } catch (e) {
      Raven.captureException(e);
      this.reset();
    }
  }

  updateMaxAmount() {
    if (this.item) {
      this.maxAmount = this.item.amount || 0;
    }
  }

  openChangeAmountPrompt() {
    // todo: internalization
    if (this.loading) {
      return;
    }
    let amount = this.amount ? this.amount.toString() : null;
    this.alertHelper
      .prompt({
        header: this.item.product.name,
        message: 'alterar quantidade',
        inputs: [
          {
            type: 'tel',
            name: 'amount',
            placeholder: 'Quantidade',
            value: amount,
            min: 0,
            max: this.maxAmount
          }
        ]
      }).then((data: any) => {
      this.loading = true;
      this.setAmount(data.amount);
    });
  }

  reset() {
    this.amount = 0;
    this.total = 0;
  }

  handlerError(error) {
    this.toastHelper.show({message: 'Desculpe, ocorreu um erro.'});
    this.loading = false;
    throw error;
  }

  goToDetail() {
    this.router.navigate(['DetailProduct', {product: this.item.product}]);
  }

}
