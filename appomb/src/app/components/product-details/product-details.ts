import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { NavController } from '@ionic/angular';
import { Utils } from '../../utils/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'product-details',
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnDestroy {
  @Input() alwaysShowNextBatch = false;
  @Input() simpleView = false;
  @Input('enableAdminView') enableAdminView = false;

  get nextBatch(): string {
    return this._nextBatch;
  }

  @Input('nextBatch')
  set nextBatch(value: string) {
    this._nextBatch = value;
  }

  @Input('product') product: Product;
  private _nextBatch: string;
  @Input('enableDetail') enableDetail = true;
  timeoutId: number;

  constructor(
    public navCtrl: NavController,
    change: ChangeDetectorRef,
    public router: Router
  ) {
    Utils.everyMinute(() => {
      try {
        change.detectChanges();
      } catch (e) {}
    }).then((id) => {
      this.timeoutId = id;
    });
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  goToDetail() {
    if (this.enableDetail) {
      this.router.navigate([
        '/DetailProduct',
        { product: JSON.stringify(this.product) },
      ]);
    }
  }

  productInStore() {
    let values = Utils.extractHourPartsFromJsonDate(this._nextBatch);
    let now = new Date();
    if (now.getHours() > parseInt(values.hour, 10)) {
      return true;
    } else if (
      now.getHours() === parseInt(values.hour, 10) &&
      now.getMinutes() > parseInt(values.minute, 10)
    ) {
      return true;
    }
    return false;
  }

  mustShowNextBatch() {
    if (!this._nextBatch) {
      return false;
    }
    if (this.alwaysShowNextBatch) {
      return true;
    }
    return !this.productInStore();
  }
}
