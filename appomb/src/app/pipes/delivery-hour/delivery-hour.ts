import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../../utils/utils';

@Pipe({
  name: 'deliveryHour',

})
export class DeliveryHourPipe implements PipeTransform {

  transform(val: any): any {
    let values = Utils.extractHourPartsFromJsonHour(val);
    if (values !== null) {
      return `${values.hour}h`;
    }
    return '';
  }
}
