import { Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';
import { Moment } from 'moment';
import { LoadingHelper } from '../../utils/loading-helper';
import { TranslateService } from '@ngx-translate/core';
import { AlertHelper } from '../../utils/alert-helper';
import { Store } from '../../shared/models/store.model';
import { Utils } from '../../utils/utils';
import { Subscription } from 'rxjs';
import { FirebaseDbService } from '../../providers/firebase-db-service';
import { ProductInventoryDay } from '../../shared/models/product-inventory-day.model';
import { ProductInventory } from '../../providers/product-inventory';
import { AdminStoreService, ChangeOrderDTO } from '../../providers/admin-store.service';
import { parseProductInventoryToReorder } from '../adm-list-products-inventory/adm-list-products-inventory';

let parseFormattedResellersIdsToReorder = (items: string[]): ChangeOrderDTO[] => {
  return items.map((item, index) => {
    return { id: Utils.undoResellerId(item), item_order: index };
  });
};

export let filterItemsWithReseller = (items: ProductInventoryDay[]) => {
  return items.filter((item) => !Utils.isNullOrUndefined(item.reseller));
};

@Component({
  selector: 'adm-list-products-resellers-inventory',
  templateUrl: './adm-list-products-resellers-inventory.html',
  styleUrl: './adm-list-products-resellers-inventory.scss',
})
export class AdmListProductsResellersInventoryComponent {
  private _day: Moment;
  private _store: Store;
  private _canReorder = false;
  firebaseSub: Subscription;
  serverReturned = false;
  items: ProductInventoryDay[] = [];
  error = false;
  searchText: string;

  itemsPerReseller: { [key: number]: ProductInventoryDay[] } = {};
  sellersIds: string[] = [];
  resellerOpen: string | null = null;
  reorderingReseller: string | null = null;

  @Output() itemsWasSet: EventEmitter<void> = new EventEmitter<void>();
  @Output() startReorder: EventEmitter<boolean> = new EventEmitter<boolean>();
  trackByResellerId: TrackByFunction<string>;
  trackByItemId: TrackByFunction<any>;

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
      this.reorderingReseller = null;
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

  notHasBreads() {
    return this.serverReturned && !this.items.length;
  }

  openReseller(resellerId: string) {
    this.resellerOpen = this.resellerOpen === resellerId ? null : resellerId;
  }

  update() {
    this.loadingHelper.setLoading('productsInventory', true);
    this.items = [];
    this.itemsPerReseller = {};
    this.serverReturned = false;
    if (!this._store || !this._day) {
      return;
    }
    this.getInventoryDay();
  }

  getInventoryDay() {
    this.unsubscribe();
    this.firebaseSub = this.firebaseService.getDay(this.day, this.store.id).subscribe(
      (resp) => {
        if (!this._canReorder) {
          this.items = filterItemsWithReseller(resp);
          const { itemsPerReseller, sellersIds } = Utils.parseProductsPerReseller(this.items);
          this.itemsPerReseller = itemsPerReseller;
          this.sellersIds = sellersIds;

          this.itemsWasSet.emit();
        }
        this.serverReturned = true;
        this.loadingHelper.setLoading('productsInventory', false);
      },
      () => {
        this.error = true;
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
    }
  }

  reorderItems(event: any) {
    if (this.reorderingReseller) {
      const movedItem = this.itemsPerReseller[this.reorderingReseller].splice(event.detail.from, 1)[0];
      this.itemsPerReseller[this.reorderingReseller].splice(event.detail.to, 0, movedItem);
    } else {
      const movedItem = this.sellersIds.splice(event.detail.from, 1)[0];
      this.sellersIds.splice(event.detail.to, 0, movedItem);
    }
    event.detail.complete();
  }

  startReorderReseller(resellerId: string) {
    this.reorderingReseller = resellerId;
    this.startReorder.emit(true);
  }

  makeSaveReorderRequest() {
    if (this.reorderingReseller) {
      return this.adminStoreService.changeOrder(
        parseProductInventoryToReorder(this.itemsPerReseller[this.reorderingReseller])
      );
    }
    return this.adminStoreService.changeResellersOrder({
      day: this.day,
      data: parseFormattedResellersIdsToReorder(this.sellersIds),
    });
  }

  saveReorder() {
    this.loadingHelper.show();
    this.makeSaveReorderRequest().subscribe(
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
