import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money',

})
export class MoneyPipe implements PipeTransform {

  transform(val: any, showZeroCents = true): any {
    if (val) {
      const parts = val.split(' ');
      let result = val;
      if (parts.length == 1) {
        result = parts[0]
      } else {
        result = parts[1]
      }
      if (!showZeroCents && result.indexOf(',00') !== -1) {
        result = result.split(',')[0]
      }
      return result
    }
    return val;
  }
}
