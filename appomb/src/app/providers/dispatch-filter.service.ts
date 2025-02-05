import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import { DeliveryEmployeeFilter } from '../pages/edit-dispatch-filter/edit-dispatch-filter';

export interface DispatchFilterData {
  with_delivery_employee: boolean;
  without_delivery_employee: boolean;
  deliveryEmployeesFilter: DeliveryEmployeeFilter[];
}

const DEFAULT: DispatchFilterData = {
  with_delivery_employee: true,
  without_delivery_employee: true,
  deliveryEmployeesFilter: []
};

@Injectable()
export class DispatchFilterService {
  changed$ = new Subject<DispatchFilterData>();

  constructor(
    private storage: Storage,
  ) {
  }

  set(data: DispatchFilterData): Promise<any> {
    return this.storage.set('DispatchFilter', JSON.stringify(data)).then(() => {
      console.log('new filter saved!');
      console.log(data);
      this.changed$.next(data);
    });
  }

  get(): Promise<DispatchFilterData> {
    return this.storage.get('DispatchFilter').then((data) => {
      if (!data) {
        return DEFAULT;
      }
      return JSON.parse(data);
    });
  }
}
