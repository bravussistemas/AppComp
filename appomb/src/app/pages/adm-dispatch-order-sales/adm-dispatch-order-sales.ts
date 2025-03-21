import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DispatchOrderService } from '../../providers/dispatch-order.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { Sales } from '../../shared/models/sales.model';
import { AlertHelper } from '../../utils/alert-helper';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'page-adm-dispatch-order-sales',
  templateUrl: './adm-dispatch-order-sales.html',
  styleUrls: ['./adm-dispatch-order-sales.scss'],
})
export class AdmDispatchOrderSalesPage {
  id: number;
  sales: Sales[];

  constructor(public navCtrl: NavController,
              private router: Router,
              private dispatchOrderService: DispatchOrderService,
              protected loadingHelper: LoadingHelper,
              private alertHelper: AlertHelper,
              private toastHelper: ToastHelper,
              private route: ActivatedRoute ) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    })
  }

  ionViewDidLoad() {
    this.load();
  }

  load() {
    this.loadingHelper.setLoading('list', true);
    this.dispatchOrderService.listSales(this.id).subscribe((resp) => {
      this.sales = resp;
      this.loadingHelper.setLoading('list', false);
    }, () => {
      this.loadingHelper.setLoading('list', false);
      this.toastHelper.connectionError();
    });
  }

  async cancelSale(saleId: number, salePrice: number) {
    const confirmed = await this.alertHelper.confirm(
      `Cancelar transação de ${salePrice}?`,
      'Tem certeza que deseja cancelar a transação?'
    );
  
    if (!confirmed) {
      return; // Se o usuário não confirmar, interrompe o fluxo
    }
  
    this.loadingHelper.show();
  
    try {
      const resp = await this.dispatchOrderService.cancelSale({
        dispatch_id: this.id,
        sale_id: saleId,
      }).toPromise();
  
      this.loadingHelper.hide();
  
      if (resp.success) {
        if (resp.is_admin_sale) {
          this.alertHelper.show(
            'Venda cancelada com sucesso!',
            'Os itens foram retornados ao estoque.'
          );
          this.router.navigate(['/previous-page']); // Navegue para a página anterior
        } else {
          this.alertHelper.show(
            'Compra estornada com sucesso!',
            'Aguarde o prazo de até 5 dias úteis para a realização do estorno da transação do cartão.'
          );
          this.load();
        }
      } else {
        this.toastHelper.show({
          message: 'Não foi possível estornar no momento, tente novamente mais tarde.',
        });
        this.load();
      }
    } catch (error) {
      console.error('Erro ao cancelar a venda:', error);
      this.toastHelper.connectionError();
      this.loadingHelper.hide();
    }
  }
}
