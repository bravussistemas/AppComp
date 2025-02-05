import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NoteTypeEnum } from '../../providers/operating-days-note.service';
import { User } from '../../shared/models/user.model';
import { Store } from '../../shared/models/store.model';
import { Utils } from '../../utils/utils';
import { StoreSellerService } from '../../providers/store-seller.service';
import { LoadingHelper } from '../../utils/loading-helper';

@Component({
  selector: 'store-options-menu-popover',
  templateUrl: 'store-options-menu-popover.html',
  styleUrl: './store-options-menu-popover.scss',
})
export class StoreOptionsMenuPopoverComponent implements OnInit {
  store: Store;
  user: User;

  enabledSaleNotification = false;
  enabledLastDeliveryNotification = false;
  loadingState = false;

  constructor(
    private storeSellerService: StoreSellerService,
    private loadingHelper: LoadingHelper,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.store = this.route.snapshot.params['store'];
    this.user = this.route.snapshot.params['user'];

    this.loadingState = true;

    try {
      const resp = await this.storeSellerService.getSeller(this.store).toPromise();
      if (resp) {
        this.enabledSaleNotification = resp.send_new_sale_push_notification;
        this.enabledLastDeliveryNotification = resp.send_delivery_finish_notification;
      }
    } catch (error) {
      console.error('Failed to fetch seller details:', error);
    } finally {
      this.loadingState = false;
    }
  }

  close() {
    // Fechar popover se necessário
  }

  goToFinancialResume() {
    this.router.navigate(['/AdminBalanceStorePage']);
  }

  goToAddOperatingDayNotePage() {
    this.router.navigate(['/AddOperatingDayNotePage'], {
      queryParams: { noteType: NoteTypeEnum.NORMAL },
    });
  }

  async enableSaleNotification(enable: boolean) {
    this.loadingState = true;
    try {
      await this.storeSellerService.update(this.store, {
        send_new_sale_push_notification: enable,
      }).toPromise();
      this.enabledSaleNotification = enable;
    } catch (error) {
      console.error('Failed to update sale notification:', error);
    } finally {
      this.loadingState = false;
    }
  }

  async enableDeliveryFinishNotification(enable: boolean) {
    this.loadingState = true;
    try {
      await this.storeSellerService.update(this.store, {
        send_delivery_finish_notification: enable,
      }).toPromise();
      this.enabledLastDeliveryNotification = enable;
    } catch (error) {
      console.error('Failed to update delivery notification:', error);
    } finally {
      this.loadingState = false;
    }
  }

  get loading() {
    return this.loadingState;
  }

  isAdminOrStoreSeller() {
    return Utils.isAdminOrStoreSeller(this.user, this.store);
  }

  isStoreSeller() {
    return Utils.sellerStoreInOwnStore(this.user, this.store);
  }
}
