import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Moment } from 'moment';
import { LoadingHelper } from '../../utils/loading-helper';
import { TranslateService } from '@ngx-translate/core';
import { AlertHelper } from '../../utils/alert-helper';
import { Store } from '../../shared/models/store.model';
import { Subscription } from 'rxjs';
import { FirebaseDbService } from '../../providers/firebase-db-service';
import { ProductInventoryDay } from '../../shared/models/product-inventory-day.model';
import { ProductInventory } from '../../providers/product-inventory';
import {
  AdminStoreService,
  ChangeOrderDTO,
} from '../../providers/admin-store.service';

export let parseProductInventoryToReorder = (
  items: ProductInventoryDay[]
): ChangeOrderDTO[] => {
  return items.map((item, index) => ({ id: item.id, item_order: index }));
};

export let parseItemsWithoutReseller = (items: ProductInventoryDay[]) => {
  return items.filter((item) => item.reseller == null);
};

@Component({
  selector: 'adm-list-products-inventory',
  templateUrl: './adm-list-products-inventory.html',
  styleUrl: './adm-list-products-inventory.scss',
})
export class AdmListProductsInventoryComponent {
  private _day: Moment;
  private _store: Store;
  private _canReorder = false;
  firebaseSub: Subscription;
  serverReturned = false;
  items: ProductInventoryDay[] = [];
  error = false;
  searchText: string;

  @Output() itemsWasSet = new EventEmitter<any>();

  @Input()
  set day(value: Moment) {
    this._day = value;
    this.update();
  }

  @Input()
  set store(value: Store) {
    this._store = value;
    this.update();
  }

  @Input()
  set canReorder(value: boolean) {
    const oldVal = this._canReorder;
    this._canReorder = value;
    if (oldVal === true && value === false) {
      this.getInventoryDay();
    }
  }

  get day(): Moment {
    return this._day;
  }

  get store(): Store {
    return this._store;
  }

  get canReorder(): boolean {
    return this._canReorder;
  }

  constructor(
    public loadingHelper: LoadingHelper,
    private trans: TranslateService,
    private firebaseService: FirebaseDbService,
    private alertHelper: AlertHelper,
    private adminStoreService: AdminStoreService,
    private productInventory: ProductInventory
  ) {}

  hasError() {
    return this.error;
  }

  update() {
    this.loadingHelper.setLoading('productsInventory', true);
    this.items = [];
    this.serverReturned = false;
    if (!(this._store && this._day)) {
      return;
    }
    this.getInventoryDay();
  }

  getInventoryDay() {
    this.unsubscribe();
    this.firebaseSub = this.firebaseService
      .getDay(this.day, this.store.id)
      .subscribe(
        (resp) => {
          if (!this._canReorder) {
            this.items = parseItemsWithoutReseller(resp);
            this.itemsWasSet.emit();
          }
          this.serverReturned = true;
          this.loadingHelper.setLoading('productsInventory', false);
        },
        () => {
          this.error = true;
          this.loadingHelper.setLoading('productsInventory', false);
        }
      );
  }

  toggleProductDay(item: ProductInventoryDay) {
    item.loading = true;
    this.productInventory.changeVisibility(item.id, !item.is_visible).subscribe(
      () => {
        item.is_visible = !item.is_visible;
        item.loading = false;
      },
      () => {
        item.loading = false;
      }
    );
  }

  unsubscribe() {
    if (this.firebaseSub) {
      this.firebaseSub.unsubscribe();
      this.firebaseSub = null;
    }
  }

  notHasBreads() {
    return this.serverReturned && !this.items.length;
  }

  reorderItems(event: any) {
    const movedItem = this.items.splice(event.detail.from, 1)[0];
    this.items.splice(event.detail.to, 0, movedItem);
    event.detail.complete();
  }

  saveReorder() {
    this.loadingHelper.show();
    this.adminStoreService
      .changeOrder(parseProductInventoryToReorder(this.items))
      .subscribe(
        () => {
          this.loadingHelper.hide();
        },
        () => {
          this.loadingHelper.hide();
          this.trans.get(['ERROR', 'ERROR_REQUEST']).subscribe((res: any) => {
            this.alertHelper.show(res.ERROR, res.ERROR_REQUEST);
          });
        }
      );
  }
}
