import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../../utils/utils';
import { District } from '../../providers/geo-service/geo-service';

@Pipe({
  name: 'districtFilter',
})
export class DistrictFilterPipe implements PipeTransform {

  transform(items: District[], filter: { search: string }): any {
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
