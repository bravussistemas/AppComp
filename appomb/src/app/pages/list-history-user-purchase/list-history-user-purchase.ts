import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IUserSettings } from '../../shared/interfaces';
import { LoadingHelper } from '../../utils/loading-helper';
import { Store } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { ToastHelper } from '../../utils/toast-helper';
import { Sales } from '../../shared/models/sales.model';
import { SalesService } from '../../providers/sales.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'page-list-history-user-purchase',
  templateUrl: './list-history-user-purchase.html',
  styleUrl: './list-history-user-purchase.scss',
})
export class ListHistoryUserPurchasePage {

  items: Sales[];
  store: Store;
  currentPage: number;
  endedPage: boolean;

  constructor(public navCtrl: NavController,
              public loadingHelper: LoadingHelper,
              private toastHelper: ToastHelper,
              private salesService: SalesService,
              private settingsService: SettingsService,
              private router: Router) {
    this.reset();
  }

  reset() {
    this.items = [];
    this.store = null;
    this.currentPage = 1;
    this.endedPage = false;
  }

  ionViewDidLoad() {
    this.reset();
    this.loadingHelper.setLoading('items', true);
    this.settingsService.getSettings().then(
      (result: IUserSettings) => {
        this.store = result.store;
        this.load().then(() => {
          this.loadingHelper.setLoading('items', false);
        });
      })
  }

  async load(): Promise<void> {
    try {
      const resp = await this.salesService.getHistoryPurchase(this.currentPage).toPromise();
  
      // Atualizar os itens de forma imutável
      this.items = [...this.items, ...resp];
    } catch (error) {
      // Checar se o erro é do tipo HttpErrorResponse
      if (error instanceof HttpErrorResponse) {
        if (error.status === 404) {
          this.endedPage = true; // Marca o final da paginação
        } else {
          this.toastHelper.connectionError(); // Trata erro de conexão
        }
      } else {
        console.error('Erro inesperado:', error);
      }
    }
  }

  doInfinite(infiniteScroll) {
    if (!this.endedPage) {
      this.currentPage++;
      this.load().then(() => {
        infiniteScroll.complete();
      });
    } else {
      infiniteScroll.complete();
    }
  }

  goToSaleDetail(sale: Sales) {
    this.router.navigate(['/DetailHistoryUserPurchasePage'], {queryParams:{sale: sale}});
  }

}
