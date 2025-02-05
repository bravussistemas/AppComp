import * as moment from "moment";
import * as Raven from "raven-js";

export class DateUtils {

  static toMoment(dt: string, format: string): moment.Moment {
    return moment(dt, format);
  }

  static datetimeToHour(datetime: string) {
    let hour = datetime;
    if (datetime && datetime.indexOf && datetime.indexOf('T') !== -1) {
      hour = datetime.split('T')[1];
    }
    return this.hourFromString(hour);
  }

  static hourFromString(dt: string): string {
    try {
      return this.toMoment(dt, 'HH:mm:ss').format('HH:mm');
    } catch (e) {
      Raven.captureException(e);
      return dt;
    }
  }

}