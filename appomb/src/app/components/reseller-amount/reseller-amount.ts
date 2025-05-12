import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Utils } from '../../utils/utils';
import { EventService } from 'src/app/providers/event.service';

declare var $: any;

@Component({
  selector: 'reseller-amount',
  templateUrl: './reseller-amount.html',
  styleUrl: './reseller-amount.scss',
})
export class ResellerAmountComponent implements OnDestroy, OnInit {
  @Input() set resellerId(value: any) {
    if (!Utils.isNullOrUndefined(value)) {
      value = Utils.undoResellerId(value);
      this._resellerId = value;
    }
  }

  updating: any;
  total: number;
  private _resellerId: number;

  constructor(private events: EventService) {}

  update = () => {
    if (this.updating) {
      clearTimeout(this.updating);
    }

    this.updating = setTimeout(() => {
      const items = document.querySelectorAll('.reseller-data-content');
      if (!items.length) return;

      let finalTotal = 0;

      items.forEach((item: Element) => {
        const resellerId = item.getAttribute('data-resellerId');
        const total = item.getAttribute('data-itemTotal');

        if (
          resellerId &&
          this._resellerId &&
          resellerId.toString() === this._resellerId.toString() &&
          total
        ) {
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
