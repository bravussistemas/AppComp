import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../../utils/utils';

@Pipe({
  name: 'batchHour',

})
export class BatchHourPipe implements PipeTransform {

  transform(val: any): any {
    let values = Utils.extractHourPartsFromJsonDate(val);
    if (values !== null) {
      return `${values.hour}:${values.minute}`;
    }
    return '';
  }
}
