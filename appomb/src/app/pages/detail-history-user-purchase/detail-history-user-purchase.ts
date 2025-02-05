import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeliveryMethod, IUserSettings } from '../../shared/interfaces';
import { LoadingHelper } from '../../utils/loading-helper';
import { Store } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { Sales } from '../../shared/models/sales.model';
import { DispatchOrderService } from '../../providers/dispatch-order.service';

@Component({
  selector: 'page-detail-history-user-purchase',
  templateUrl: './detail-history-user-purchase.html',
  styleUrls: ['./detail-history-user-purchase.scss']
})

export class DetailHistoryUserPurchasePage {

  store: Store;
  sale: Sales;
  dispatchId: number;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loadingHelper: LoadingHelper,
              private settingsService: SettingsService,
              private dispatchOrderService: DispatchOrderService,) {
    this.sale = JSON.parse(route.snapshot.paramMap.get('sale')) as Sales;
    this.dispatchId = parseInt(route.snapshot.paramMap.get('dispatchId'));
  }

  ionViewDidLoad() {
    if (this.dispatchId) {
      this.loadingHelper.show();
      this.dispatchOrderService.getDispatchSale(this.dispatchId).toPromise()
        .then((result: Sales) => {
          this.loadingHelper.hide();
          this.sale = result;
        });
    }
  }

  isDelivery() {
    return this.sale && this.sale.delivery_method == DeliveryMethod.DELIVERY_METHOD_HOUSE;
  }

}
