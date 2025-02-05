import { Component, Input, OnInit } from '@angular/core';
import { ProductInventoryDay } from '../../shared/models/product-inventory-day.model';
import { AlertHelper } from '../../utils/alert-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { NavController } from '@ionic/angular';
import { ProductInventory } from '../../providers/product-inventory';
import { Store } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { IUserSettings } from '../../shared/interfaces';
import { Moment } from 'moment';
import { HttpUtils } from '../../utils/http-utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'adm-product-amount-control',
  templateUrl: 'adm-product-amount-control.html'
})
export class AdmProductAmountControl implements OnInit {
  @Input() day: Moment;
  @Input() enableDetail = true;

  @Input() 
  set item(val: ProductInventoryDay) {
    this._item = val;
    this.update();
  }

  get item(): ProductInventoryDay {
    return this._item;
  }

  maxAmount: number = 0;
  loading = false;
  store: Store;
  private _item: ProductInventoryDay;

  get disabled(): boolean {
    return !this.store || this.loading;
  }

  constructor(
    private navCtrl: NavController,
    private toastHelper: ToastHelper,
    private settingsService: SettingsService,
    private productInventory: ProductInventory,
    private trans: TranslateService,
    private alertHelper: AlertHelper
  ) {}

  ngOnInit() {
    this.settingsService.getSettings().then((result: IUserSettings) => {
      this.store = result.store;
    });
  }

  isValid(): boolean {
    return !!this.item && !!this.day;
  }

  private addAmount(amount: number): void {
    if (this.isValid()) {
      amount = parseInt(amount.toString(), 10);
      if (!this.checkValidValue(amount)) {
        return;
      }
      this.loading = true;
      this.productInventory
        .addProductInventory({
          product: this.item.product.id,
          store: this.store.id,
          amount: amount,
          day_ref: HttpUtils.dateToUrl(this.day),
        })
        .subscribe(
          () => {
            this.loading = false;
            this.maxAmount += amount;
          },
          (e) => this.handleError(e)
        );
    }
  }

  private removeAmount(amount: number): void {
    if (this.isValid()) {
      amount = parseInt(amount.toString(), 10);
      if (!this.checkValidValueToRemove(amount)) {
        return;
      }
      this.loading = true;
      this.productInventory
        .removeProductInventory({
          product: this.item.product.id,
          store: this.store.id,
          amount: amount,
          day_ref: HttpUtils.dateToUrl(this.day),
        })
        .subscribe(
          () => {
            this.loading = false;
            this.maxAmount -= amount;
          },
          (e) => this.handleError(e)
        );
    }
  }

  update(): void {
    if (this.item) {
      this.updateMaxAmount();
    }
  }

  private checkValidValue(amount: number): boolean {
    if (amount < 1) {
      this.loading = false;
      this.trans.get('INSERT_MORE_THAN_ZERO').subscribe((val) => {
        this.toastHelper.show({
          message: val,
          position: 'middle',
          cssClass: 'toast-custom-white',
        });
      });
      return false;
    }
    return true;
  }

  private checkValidValueToRemove(amount: number): boolean {
    if (this.maxAmount < amount) {
      this.loading = false;
      this.trans.get('WITHOUT_QTD_TO_REMOVE').subscribe((val) => {
        this.toastHelper.show({
          message: val,
          position: 'middle',
          cssClass: 'toast-custom-white',
        });
      });
      return false;
    }
    return this.checkValidValue(amount);
  }

  private updateMaxAmount(): void {
    this.maxAmount = this.item?.amount || 0;
  }

  openRemoveAmountPrompt(): void {
    if (this.loading) return;
    this.alertHelper
      .prompt({
        header: 'REMOVER',
        message: this.item.product.name,
        inputs: [
          {
            type: 'tel',
            name: 'amount',
            placeholder: 'Quantidade',
            min: 0,
            max: this.maxAmount,
          },
        ],
      })
      .then((data: any) => {
        this.removeAmount(data.amount);
      });
  }

  openAddAmountPrompt(): void {
    if (this.loading) return;
    this.alertHelper
      .prompt({
        header: 'ADICIONAR',
        message: this.item.product.name,
        inputs: [
          {
            type: 'tel',
            name: 'amount',
            placeholder: 'Quantidade',
            min: 0,
          },
        ],
      })
      .then((data: any) => {
        this.addAmount(data.amount);
      });
  }

  private handleError(error: any): void {
    this.loading = false;
    const message = error?.message || 'Desculpe, ocorreu um erro.';
    this.toastHelper.show({ message, cssClass: 'toast-custom-white' });
  }

  goToDetail(): void {
    if (this.enableDetail) {
      this.navCtrl.navigateForward('/detail-product', {
        state: { product: this.item.product },
      });
    }
  }
}
