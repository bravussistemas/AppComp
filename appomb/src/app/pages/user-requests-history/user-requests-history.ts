import { Component, Renderer2, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { IUserSettings } from '../../shared/interfaces';
import { Store } from '../../shared/models/store.model';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { SalesService } from '../../providers/sales.service';
import { DispatchOrderRequests } from '../../shared/models/dispatch-order.model';
import { DispatchOrderService } from '../../providers/dispatch-order.service';
import { SettingsService } from '../../providers/settings-service';

@Component({
  selector: 'page-user-requests-history',
  templateUrl: './user-requests-history.html',
  styleUrls: ['./user-requests-history.scss'],
})
export class UserRequestsHistoryPage {

  store: Store;
  userSales: DispatchOrderRequests[] = [];
  hasPendingSales = false;
  canRefresh: boolean | null = true;
  currentTab: string = 'actual';
  private refreshTimeout: any;

  @ViewChild(IonContent) content: IonContent;

  constructor(
    protected loadingHelper: LoadingHelper,
    private toastHelper: ToastHelper,
    private renderer: Renderer2,
    private salesService: SalesService,
    private dispatchOrderService: DispatchOrderService,
    private settingsService: SettingsService,
    private router: Router
  ) {}

  ionViewDidEnter() {
    this.loadingHelper.setLoading('items', true);
    this.settingsService.getSettings()
      .then((result: IUserSettings) => {
        this.store = result.store;
        this.load();
      });
  }

  onClickItem(item: DispatchOrderRequests) {
    this.router.navigate(['/DetailHistoryUserPurchasePage'], { queryParams: { dispatchId: item.id } });
  }

  onSegmentChanged(segmentButton) {
  }

  getHeaderAction() {
    if (this.canRefresh === null || this.canRefresh) {
      return {
        icon: 'refresh',
        handler: () => this.refresh(),
      };
    }
    return {};
  }

  refresh() {
    if (!this.canRefresh) return;

    this.canRefresh = false;
    clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(() => {
      this.canRefresh = true;
    }, 10000); // 10 segundos de debounce

    this.load();
  }

  load() {
    this.loadingHelper.setLoading('listUserSales', true);
    this.dispatchOrderService.listUserSales().subscribe({
      next: (resp) => {
        this.loadingHelper.setLoading('listUserSales', false);
        this.hasPendingSales = resp.has_any_open;
        this.userSales = resp.data || [];
      },
      error: () => {
        this.loadingHelper.setLoading('listUserSales', false);
        this.toastHelper.connectionError();
      }
    });
  }

  get userSalesActual() {
    return this.userSales?.filter(item => item.active_request) || [];
  }

  get userSalesPrevious() {
    return this.userSales?.filter(item => !item.active_request) || [];
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    this.content.scrollToTop(300); // Smooth scroll to top when changing tabs
  }
}
