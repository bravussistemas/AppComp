import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../../utils/utils';
import { Product } from '../../shared/models/product.model';

@Pipe({
  name: 'productFilter',
})
export class ProductFilterPipe implements PipeTransform {

  transform(items: Product[], filter: { name: string }): any {
    if (!items || !filter) {
      return items;
    }
    if (!filter.name) {
      return items;
    }
    return items.filter(item => {
      if (item.name) {
        return Utils.equalString(item.name, filter.name, false);
      }
      return true;
    });
  }
}
