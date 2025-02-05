import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import * as moment from "moment";

@Injectable()
export class DateService {

  constructor() {
  }

  today(): moment.Moment {
    return moment().set({hour: 0, minute: 0, second: 0, millisecond: 0});
  }

}
