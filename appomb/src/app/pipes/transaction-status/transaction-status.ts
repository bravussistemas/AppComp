import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionStatusColor',
})
export class TransactionStatusPipe implements PipeTransform {

  transform(status: any): any {
    if (status) {
      status = status.toString();
      if (status === "20") {
        return "success";
      } else if (["30", "40", "60", "70"].indexOf(status) !== -1) {
        return "error";
      } else {
        return "warning";
      }
    }
  }
}
