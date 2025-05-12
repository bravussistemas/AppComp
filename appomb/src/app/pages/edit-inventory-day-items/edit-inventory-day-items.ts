import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  IonContent,
  IonSearchbar,
  ModalController,
  SearchbarInputEventDetail,
} from '@ionic/angular';
import { ProductForEdit } from '../../shared/models/product.model';
import { ProductService } from '../../providers/product.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductInventory } from '../../providers/product-inventory';
import * as moment from 'moment';
import { ProductInventoryDay } from '../../shared/models/product-inventory-day.model';
import { LoadingHelper } from '../../utils/loading-helper';
import { HttpUtils } from '../../utils/http-utils';
import { SettingsService } from '../../providers/settings-service';
import { IUserSettings } from '../../shared/interfaces';
import { Store } from '../../shared/models/store.model';
import { AlertHelper } from '../../utils/alert-helper';
import { DateUtils } from '../../utils/dateUtils';
import { EventService } from 'src/app/providers/event.service';
import { IonSearchbarCustomEvent } from '@ionic/core';

class ProductItem {
  product: ProductForEdit;
  active: boolean;
  next_batch: string;
}

@Component({
  selector: 'app-edit-inventory-day-items',
  templateUrl: './edit-inventory-day-items.html',
  styleUrl: './edit-inventory-day-items.scss',
})
export class EditInventoryDayItemsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;

  day: any;
  productItems: ProductItem[] = [];
  inventory: ProductInventoryDay[] = [];
  products: ProductForEdit[] = [];
  store: Store;
  searchText: string;
  resellerMode: boolean;

  constructor(
    private settingsService: SettingsService,
    private modalCtrl: ModalController,
    private trans: TranslateService,
    private alertHelper: AlertHelper,
    private renderer: Renderer2,
    private events: EventService,
    public loadingHelper: LoadingHelper,
    private productInventoryService: ProductInventory,
    public productService: ProductService
  ) {}

  ngOnInit() {
    this.loadingHelper.setLoading('list', true);

    // Inicializa dados
    this.settingsService
      .getSettings()
      .then((result: IUserSettings) => {
        this.store = result.store;
        this.init();
      })
      .catch(this.handlerError.bind(this));

    // Foco no search após a inicialização
    setTimeout(() => this.searchBar?.setFocus(), 500);
  }

  init() {
    const data =
      this.resellerMode !== undefined
        ? { without_reseller: !this.resellerMode }
        : {};
    const getProducts = this.productService
      .listForEdit(data)
      .toPromise()
      .then((res) => (this.products = res))
      .catch(this.handlerError.bind(this));

    const params = {
      is_active: true,
      store_id: this.store.id,
    };

    const getInventory = this.productInventoryService
      .getDay(moment(this.day), params)
      .toPromise()
      .then((res) => (this.inventory = res))
      .catch(this.handlerError.bind(this));

    Promise.all([getProducts, getInventory]).then(() => {
      this.parse();
    });
  }

  parse() {
    const activatedItems: { [key: number]: any } = {};
    this.inventory.forEach((item) => {
      if (item.product?.id) {
        activatedItems[item.product.id.toString()] = item.next_batch;
      }
    });

    this.productItems = this.products.map((item) => {
      const productItem = new ProductItem();
      productItem.product = item;
      productItem.next_batch =
        DateUtils.datetimeToHour(
          activatedItems[item.id.toString()] || item.next_batch_default
        ) || '';
      productItem.active = !!activatedItems[item.id.toString()];
      return productItem;
    });

    this.loadingHelper.setLoading('list', false);
  }

  getActivatedItems() {
    return this.productItems
      .filter((val) => val.active)
      .map((val) => ({ id: val.product.id, next_batch: val.next_batch }));
  }

  toggleActive(event: Event, item: ProductItem) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('no-click')) {
      return;
    }
    item.active = !item.active;
  }

  saveChanges() {
    this.loadingHelper.show();

    this.productInventoryService
      .editProductsOnDay({
        products: this.getActivatedItems(),
        store: this.store.id,
        day: HttpUtils.dateToUrl(this.day),
      })
      .toPromise()
      .then(() => {
        this.loadingHelper.hide();
        this.events.emitEvent('inventoryEdited'); // Substitui publish
        this.dismiss();
      })
      .catch(this.handlerError.bind(this));
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  handlerError(error: any) {
    this.dismiss();
    this.loadingHelper.hide();
    this.trans.get('ERROR_REQUEST').subscribe((val) => {
      this.alertHelper.show(val);
    });
  }

  onInput(e) {}
}
