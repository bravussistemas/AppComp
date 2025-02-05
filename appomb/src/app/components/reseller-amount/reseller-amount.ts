import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Utils } from '../../utils/utils';
import { EventService } from 'src/app/providers/event.service';

declare var $;

@Component({
  selector: 'reseller-amount',
  templateUrl: './reseller-amount.html',
  styleUrl: './reseller-amount.scss'
})
export class ResellerAmountComponent implements OnDestroy, OnInit {
  @Input() set resellerId(value: any) {
    if (!Utils.isNullOrUndefined(value)) {
      value = Utils.undoResellerId(value);
      this._resellerId = value;
    }
  }

  updating;
  total: number;
  private _resellerId: number;

  constructor(private events: EventService) {
  }

  update = () => { // Ionic Events requires arrow functions to make right unsubscribe
    if (!Utils.isNullOrUndefined(this.updating)) {
      clearTimeout(this.updating);
    }
    this.updating = setTimeout(() => {
      let items = $(document).find('.reseller-data-content');
      if (!items) {
        return;
      }
      let finalTotal = 0;
      items.each((_, item) => {
        let a = $(item);
        let resellerId = a.attr('data-resellerId');
        if (resellerId && this._resellerId && resellerId.toString() === this._resellerId.toString()) {
          let total = a.attr('data-itemTotal');
          if (!total) {
            return;
          }
          finalTotal += parseInt(total, 10);
        }
      });
      this.total = finalTotal;
    }, 300);
  };

  ngOnDestroy(): void {
    this.events.unsubscribe('cartChanged');
  }

  ngOnInit(): void {
    this.update();
    this.events.onEvent('cartChanged').subscribe(this.update);
  }

}
