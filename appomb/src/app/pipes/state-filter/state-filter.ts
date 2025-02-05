import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../../utils/utils';
import { State } from '../../providers/geo-service/geo-service';

@Pipe({
  name: 'stateFilter',
})
export class StateFilterPipe implements PipeTransform {

  transform(items: State[], filter: { search: string }): any {
    if (!items || !filter) {
      return items;
    }
    if (!filter.search) {
      return items;
    }
    return items.filter(item => {
      let byName = false;
      if (item.name) {
        byName = Utils.equalString(item.name, filter.search, false);
      }
      let byAbbr = false;
      if (item.abbr) {
        byAbbr = Utils.equalString(item.abbr, filter.search, false);
      }
      return byName || byAbbr;
    });
  }
}
