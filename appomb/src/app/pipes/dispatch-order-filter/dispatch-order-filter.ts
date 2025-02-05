import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../../utils/utils';
import { DispatchOrderAdminList } from '../../shared/models/dispatch-order.model';
import { DispatchFilterData } from '../../providers/dispatch-filter.service';

function isMatchSearch(item: DispatchOrderAdminList, search: string) {
  let nameMatches = false;
  if (item) {
    if (item.c_name) {
      nameMatches = Utils.equalString(item.c_name, search, false) || Utils.equalString(search, item.c_name, false);
    }
  }
  return nameMatches;
}

@Pipe({
  name: 'dispatchOrderFilter',
})
export class DispatchOrderFilterPipe implements PipeTransform {

  transform(items: DispatchOrderAdminList[], filter: { name: string; dispatchFilter?: DispatchFilterData }): any {
    console.log('filter');
    console.dir(filter);
    if (!items || !filter) {
      return items;
    }
    if (!filter.name && !filter.dispatchFilter) {
      return items;
    }
    let choosedEmployees = [];
    if (filter.dispatchFilter && filter.dispatchFilter.deliveryEmployeesFilter) {
      choosedEmployees = filter.dispatchFilter.deliveryEmployeesFilter.filter(item => item.checked).map(item => item.id);
    }
    return items.filter(item => {
      const term = !filter.name || isMatchSearch(item, filter.name);
      let filterWithDeliveryEmployee = true;
      let isEmployeeFiltered = true;
      if (filter.dispatchFilter) {
        if (filter.dispatchFilter.with_delivery_employee && filter.dispatchFilter.without_delivery_employee) {
          filterWithDeliveryEmployee = true;
        } else if (!filter.dispatchFilter.with_delivery_employee && !filter.dispatchFilter.without_delivery_employee) {
          filterWithDeliveryEmployee = true;
        } else if (!filter.dispatchFilter.without_delivery_employee) {
          filterWithDeliveryEmployee = !!item.del_emp;
        } else if (!filter.dispatchFilter.with_delivery_employee) {
          filterWithDeliveryEmployee = !item.del_emp;
        }
        if (choosedEmployees.length) {
          isEmployeeFiltered = choosedEmployees.indexOf(item.del_emp_id) != -1;
        }
      }
      return term && filterWithDeliveryEmployee && isEmployeeFiltered;
    });
  }
}
