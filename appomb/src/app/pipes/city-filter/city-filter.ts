import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../../utils/utils';
import { City } from '../../providers/geo-service/geo-service';

@Pipe({
  name: 'cityFilter',
})
export class CityFilterPipe implements PipeTransform {

  transform(items: City[], filter: { search: string }): any {
    if (!items || !filter) {
      return items;
    }
    if (!filter.search) {
      return items;
    }
    return items.filter(item => {
      return Utils.equalString(item.name, filter.search, false);
    });
  }
}
