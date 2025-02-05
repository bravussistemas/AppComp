import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productCategoryFilter',
})
export class ProductCategoryFilterPipe implements PipeTransform {

  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => item.category == filter.category);
  }
}
