import { Component, Renderer2, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { IUserSettings } from '../../shared/interfaces';
import { LoadingHelper } from '../../utils/loading-helper';
import { Store, StoreTypeEnum } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { ToastHelper } from '../../utils/toast-helper';
import { SalesService } from '../../providers/sales.service';

@Component({
  selector: 'page-list-user-sales',
  templateUrl: './list-user-sales.html',
  styleUrls: ['./list-user-sales.scss'],
})
export class ListUserSalesPage {
  store: Store;
  items: Record<string, any> = {};
  total: Record<string, any> = {};
  days: string[] = [];
  clientHasDispatchToday = false;
  continueBuying = false;

  @ViewChild('rootContent', { static: false }) rootContent: IonContent;

  constructor(
    private router: Router,
    public loadingHelper: LoadingHelper,
    private toastHelper: ToastHelper,
    private renderer: Renderer2,
    private salesService: SalesService,
    private settingsService: SettingsService
  ) {
    // Obter valor de navegação caso continueBuying seja necessário
    const navigation = this.router.getCurrentNavigation();
    this.continueBuying = navigation?.extras?.state?.['continueBuying'] ?? false;
  }

  get isStoreDelivery(): boolean {
    return this.store?.store_type === StoreTypeEnum.DELIVERY;
  }

  ionViewWillEnter() {
    this.loadingHelper.setLoading('items', true);

    if (this.continueBuying) {
      // Configurações para botão "Voltar" na navegação
      history.pushState(null, '', location.href); // Previne navegação inválida
      window.onpopstate = () => this.router.navigate(['/HomePage']);
    }

    this.settingsService.getSettings().then((result: IUserSettings) => {
      this.store = result.store;
      this.load();
    });
  }

  private setupStyles(): void {
    if (this.canShowButton()) {
      this.rootContent.getScrollElement().then((content) => {
        this.renderer.addClass(content, 'content-with-bottom-bar');
      });
    }
  }

  private canShowButton(): boolean {
    return false; // Atualize conforme a lógica necessária
  }

  private load(): void {
    this.salesService.listFromUser(this.store.id).subscribe(
      (resp) => {
        const items = resp.items;
        const days = Object.keys(items);
        this.days = days;
        this.items = items;
        this.total = resp.total;
        this.clientHasDispatchToday = resp.client_has_dispatch_today;
        this.setupStyles();
        this.loadingHelper.setLoading('items', false);
      },
      () => {
        this.toastHelper.connectionError();
        this.loadingHelper.setLoading('items', false);
      }
    );
  }

  goToContinueBuying(): void {
    this.router.navigate(['/HomePage']);
  }
}
