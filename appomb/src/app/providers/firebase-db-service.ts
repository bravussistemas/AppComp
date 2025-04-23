import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Moment } from 'moment';
import { AppConfig } from '../../configs';
import { ProductInventoryDay } from '../shared/models/product-inventory-day.model';
import { DispatchOrderAdminList } from '../shared/models/dispatch-order.model';

// Define your interfaces if not already defined
// Replace these with your actual interface definitions

@Injectable({
  providedIn: 'root', // Ensure the service is provided in the root
})
export class FirebaseDbService {
  constructor(private db: AngularFireDatabase, private appConfig: AppConfig) {}

  /**
   * Retrieves the inventory for a specific day and store.
   * @param day - The day to retrieve inventory for.
   * @param storeId - The store ID.
   * @returns An Observable of ProductInventoryDay array.
   */
  getDay(day: Moment, storeId: number): Observable<ProductInventoryDay[]> {
    const path = `/${this.appConfig.FIREBASE_DB_INVENTORY_DAY}/${storeId}/${day.format('YYYYMMDD')}/`;

    return this.db.list<ProductInventoryDay>(path).valueChanges();
  }

  /**
   * Watches inventory changes for a specific store.
   * @param storeId - The store ID.
   * @returns An Observable of inventory data.
   */
  watchInventoryChanges(): Observable<any[]> {
    // Replace 'any' with actual inventory type
    const path = `/${this.appConfig.FIREBASE_DB_INVENTORY_DATA}`;
    return this.db.list<any>(path).valueChanges();
  }

  /**
   * Watches changes to the stores data.
   * @returns An Observable of IFirebaseStoresDb.
   */
  watchStoresChanges(): Observable<any> {
    const path = `/${this.appConfig.FIREBASE_DB_STORES_CHANGED}`;
    return this.db.object<any>(path).valueChanges();
  }

  /**
   * Watches changes to the delivery ended data.
   * @returns An Observable of any type (replace with actual type if available).
   */
  watchDeliveryEndedChanges(): Observable<any> {
    // Replace 'any' with actual type
    const path = `/${this.appConfig.FIREBASE_DB_DELIVERY_ENDED}`;
    return this.db.object<any>(path).valueChanges();
  }

  /**
   * Watches changes to the operating notes for a specific store.
   * @param storeId - The store ID.
   * @returns An Observable of any type (replace with actual type if available).
   */
  watchOperatingNotesDaysChanges(storeId: number): Observable<any> {
    // Replace 'any' with actual type
    const path = `/${this.appConfig.FIREBASE_DB_OPERATING_NOTES_CHANGES}/${storeId}/`;
    return this.db.object<any>(path).valueChanges();
  }

  /**
   * Lists dispatch orders for a specific day and store.
   * @param day - The day to retrieve dispatch orders for.
   * @param storeId - The store ID.
   * @returns An Observable of DispatchOrderAdminList array.
   */
  listDispatchOrders(
    day: Moment,
    storeId: number
  ): Observable<DispatchOrderAdminList[]> {
    const path = `/${this.appConfig.FIREBASE_DB_DISPATCH_ORDERS}/${day.format(
      'YYYYMMDD'
    )}/`;
    return this.db
      .list<DispatchOrderAdminList>(path, (ref) =>
        ref.orderByChild('store_id').equalTo(storeId)
      )
      .valueChanges();
  }
}
