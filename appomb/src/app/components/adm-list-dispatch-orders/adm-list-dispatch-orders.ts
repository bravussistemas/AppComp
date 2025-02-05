import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Moment } from 'moment';
import { LoadingHelper } from '../../utils/loading-helper';
import { Store, StoreTypeEnum } from '../../shared/models/store.model';
import { Subscription } from 'rxjs';
import { FirebaseDbService } from '../../providers/firebase-db-service';
import {
  DispatchOrderAdminList,
  DispatchOrderByDeliveryArea,
  DispatchOrderByHour
} from '../../shared/models/dispatch-order.model';
import { Utils } from '../../utils/utils';
import { DispatchFilterData, DispatchFilterService } from '../../providers/dispatch-filter.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'adm-list-dispatch-orders',
  templateUrl: './adm-list-dispatch-orders.html',
  styleUrl: './adm-list-dispatch-orders.scss'
})
export class AdmListDispatchOrdersComponent implements OnDestroy, OnInit {
  @Input('user') user: User;

  ngOnDestroy(): void {
    // console.log('AdmListDispatchOrdersComponent.ngOnDestroy');
    this.allSubs.unsubscribe();
    this.dispatchFilterSub.unsubscribe();
  }

  ngOnInit(): void {
    this.dispatchFilterSub = this.dispatchFilterService.changed$.subscribe((data) => {
      // console.log('changed!', data);
      this.dispatchFilter = data;
      this.ref.detectChanges();
    })
  }

  private day: Moment;
  protected store: Store;

  serverReturned = false;

  allSubs = new Subscription();
  itemsOpened: number[] = [];
  itemsOpenedByDelivery: number[] = [];
  items: DispatchOrderAdminList[] = [];
  itemsWithProblem: DispatchOrderAdminList[] = [];
  itemsStoreNormal: DispatchOrderAdminList[] = [];
  itemsByDeliveryHour: DispatchOrderByHour[] = [];
  itemsClosed: DispatchOrderAdminList[] = [];

  searchText: string;

  dispatchFilter: DispatchFilterData;
  dispatchFilterSub: Subscription;

  get data(): { store: Store; day: Moment } {
    return this._data;
  }

  @Input() mapList: (items: DispatchOrderAdminList[]) => DispatchOrderAdminList[];
  @Output() listUpdated: EventEmitter<DispatchOrderAdminList[]> = new EventEmitter<DispatchOrderAdminList[]>();

  @Input()
  set data(value: { store: Store; day: Moment }) {
    this._data = value;
    if (Utils.isNullOrUndefined(value) || Utils.isObjectEmpty(value) || Utils.isNullOrUndefined(value.day) || Utils.isNullOrUndefined(value.store)) {
      return;
    }
    if (value.day.isSame(this.day, 'date') && (this.store && this.store.id) === value.store.id) {
      return;
    }
    this.day = value.day;
    this.store = value.store;
    this.update();
  }

  private _data: { store: Store, day: Moment };

  constructor(public loadingHelper: LoadingHelper,
              private ref: ChangeDetectorRef,
              public dispatchFilterService: DispatchFilterService,
              private firebaseService: FirebaseDbService,) {
  }

  listItemUpdated() {
    this.updateItemsList(this.items);
  }

  update() {
    this.serverReturned = false;
    this.loadingHelper.setLoading('dispatchOrders', true);
    this.allSubs.unsubscribe();
    this.allSubs = new Subscription();
    this.dispatchFilterService.get().then(data => {
      this.dispatchFilter = data;
      this.allSubs.add(this.firebaseService.listDispatchOrders(this.day, this.store.id).subscribe(
        (resp) => {
          resp = this.mapList ? this.mapList(resp) : resp;
          this.items = resp;
          this.updateItemsList(resp);
          this.listUpdated.emit(resp);
          this.serverReturned = true;
          this.loadingHelper.setLoading('dispatchOrders', false);
        },
        () => this.handlerError()
      ));
    });
  }

  updateItemsList(items) {
    // console.log('updateItemsList', items);
    this.itemsWithProblem = items.filter((value: DispatchOrderAdminList) => {
      return value.has_plm;
    });
    const itemsOpened = items.filter((value: DispatchOrderAdminList) => {
      return value.is_clo === false && !value.has_plm;
    });

    this.itemsStoreNormal = itemsOpened.filter(i => !i.is_del);

    const result: { [key: number]: DispatchOrderByHour } = {};

    function makeLabel(value) {
      if (!value) return '';
      return `${value.split(':')[0]}H`
    }

    function makeStartHour(value): number {
      if (!value) return 0;
      return parseInt(value.split(':')[0] || 0) || 0
    }

    itemsOpened.filter(i => i.is_del).forEach((item) => {
      if (!result.hasOwnProperty(item.d_hour_id)) {
        result[item.d_hour_id] = {
          id: item.d_hour_id,
          label: `${makeLabel(item.d_hour_s)} - ${makeLabel(item.d_hour_e)}`,
          startHour: makeStartHour(item.d_hour_s),
          items: [item],
          itemsByDeliveryArea: [],
          count: 1,
          countWithDeliveryMan: item.del_emp ? 1 : 0,
          opened: this.itemsOpened.indexOf(item.d_hour_id) !== -1
        }
      } else {
        result[item.d_hour_id].items.push(item);
        result[item.d_hour_id].count += 1;
        result[item.d_hour_id].countWithDeliveryMan += item.del_emp ? 1 : 0;
      }
    });
    let resultArray: DispatchOrderByHour[] = [];
    for (const item in result) {
      resultArray.push(result[item]);
    }
    resultArray = resultArray.sort(function (a, b) {
      if (a.startHour < b.startHour) {
        return -1;
      } else {
        return 1;
      }
    });
    // console.log(this.itemsOpenedByDelivery);
    resultArray.forEach((item) => {
      let resultByDeliveryArea: { [key: number]: DispatchOrderByDeliveryArea } = {};
      item.items.forEach((sale) => {
        if (!resultByDeliveryArea.hasOwnProperty(sale.d_area_id)) {
          resultByDeliveryArea[sale.d_area_id] = {
            id: sale.d_area_id,
            order: sale.d_area_order,
            label: sale.d_area_nm,
            items: [sale],
            count: 1,
            countWithDeliveryMan: sale.del_emp ? 1 : 0,
            opened: this.itemsOpenedByDelivery.indexOf(sale.d_area_id) !== -1
          }
        } else {
          resultByDeliveryArea[sale.d_area_id].items.push(sale);
          resultByDeliveryArea[sale.d_area_id].count += 1;
          resultByDeliveryArea[sale.d_area_id].countWithDeliveryMan += sale.del_emp ? 1 : 0;
        }
      });
      // console.log('resultByDeliveryArea', resultByDeliveryArea);
      let resultArray2: DispatchOrderByDeliveryArea[] = [];
      for (const item in resultByDeliveryArea) {
        // console.log('resultByDeliveryArea[item].items', resultByDeliveryArea[item].items);
        resultArray2.push(resultByDeliveryArea[item]);
      }
      resultArray2 = resultArray2.sort(function (a, b) {
        if (a.order < b.order) {
          return -1;
        } else {
          return 1;
        }
      });
      item.itemsByDeliveryArea = resultArray2;
    });
    // console.log('resultArray', resultArray);
    this.itemsByDeliveryHour = resultArray;

    this.itemsClosed = items.filter((value: DispatchOrderAdminList) => {
      return value.is_clo === true && !value.has_plm;
    });

  };

  isEmptyList() {
    return this.serverReturned && !this.items.length;
  }

  handlerError() {
  }

  openGroup(group) {
    group.opened = !group.opened;
    if (group.opened) {
      this.itemsOpened.push(group.id);
    } else {
      this.itemsOpened.splice(this.itemsOpened.indexOf(group.id), 1);
    }
  }

  openGroupDelivery(group) {
    group.opened = !group.opened;
    if (group.opened) {
      this.itemsOpenedByDelivery.push(group.id);
    } else {
      this.itemsOpenedByDelivery.splice(this.itemsOpenedByDelivery.indexOf(group.id), 1);
    }
    // console.log(this.itemsOpenedByDelivery);
  }

  get isAdminOrSeller() {
    return Utils.isAdminOrStoreSeller(this.user, this.store);
  }


}
