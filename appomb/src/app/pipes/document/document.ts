import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../../utils/utils';

@Pipe({
  name: 'document',

})
export class DocumentPipe implements PipeTransform {

  transform(val: any): any {
    if (val) {
      return Utils.maskDocument(val)
    }
    return val;
  }
}
