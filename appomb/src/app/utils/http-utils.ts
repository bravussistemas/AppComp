import { Moment } from "moment";

export class HttpUtils {
  static dateToUrl(date: Moment) {
    return date.format('YYYY-MM-DD');
  }
}