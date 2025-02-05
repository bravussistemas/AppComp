import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from "../../utils/utils";

@Pipe({
  name: 'productInventoryDayFilter',
})
export class ProductInventoryDayFilterPipe implements PipeTransform {

  transform(items: any[], filter: { name: string }): any {
    if (!items || !filter) {
      return items;
    }
    if (!filter.name) {
      return items;
    }
    return items.filter(item => {
      if (item.product && item.product.name) {
        return Utils.equalString(item.product.name, filter.name, false);
      }
    });
  }
}
