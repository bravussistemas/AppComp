import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DispatchOrderAdminList } from '../../shared/models/dispatch-order.model';
import { AdminStoreService } from '../../providers/admin-store.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { ModalController, NavController } from '@ionic/angular';
import { AlertHelper } from '../../utils/alert-helper';
import { DispatchFilterData } from '../../providers/dispatch-filter.service';
import { User } from '../../shared/models/user.model';
import { DispatchOrderService } from '../../providers/dispatch-order.service';
import { Address, Point } from '../../shared/models/address.model';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { Utils } from '../../utils/utils';
import { Store } from '../../shared/models/store.model';
import { Router } from '@angular/router';
import { ChooseDeliveryEmployeePage } from 'src/app/pages/choose-delivery-employee/choose-delivery-employee';

@Component({
  selector: 'adm-dispatch-list-item',
  templateUrl: './adm-dispatch-list-item.html',
  styleUrl: './adm-dispatch-list-item.scss'
})
export class AdmDispatchListItemComponent {

  @Input('items') items: DispatchOrderAdminList[];
  @Input('searchTerm') searchTerm: string;
  @Input('user') user: User;
  @Input('store') store: Store;
  @Input('dispatchFilter') dispatchFilter: DispatchFilterData;
  @Output() listItemUpdated: EventEmitter<any> = new EventEmitter<any>();
  loadingIds = [];
  imageError: any;

  constructor(private adminStoreService: AdminStoreService,
              private toastHelper: ToastHelper,
              private dispatchOrderService: DispatchOrderService,
              private modalCtrl: ModalController,
              private launchNavigator: LaunchNavigator,
              private alertHelper: AlertHelper,
              private navCtrl: NavController,
              public loadingHelper: LoadingHelper,
              private router: Router,) {
  }

  isEmptyList() {
    return !this.items || !this.items.length;
  }

  goToDetail(id: number) {
    this.router.navigate(['/AdmDetailDispatchOrderPage', id]);
  }

  async openChooseDeliveryEmployee(item: DispatchOrderAdminList) {
    const modal = this.modalCtrl.create({
      component: ChooseDeliveryEmployeePage,
      componentProps:{
        dispatchId: item.id
      }
    });
    (await modal).present()
    .catch((e) => console.error(e));
  }

  notifyDeliveryComming(item: DispatchOrderAdminList) {
    this.alertHelper.confirm(
      `Confirmar aviso que está a caminho?`,
      'Vamos tentar notificar o cliente por push.',
      'Confirmar',
      'Cancelar',
    ).then((confirmed) => {
      if (!confirmed) {
        return;
      }
      this.setItemLoading(item);
      this.dispatchOrderService.notifyDeliveryEmployeeIsComing(item.id)
        .subscribe((resp) => {
          if (resp.success) {
            item.is_cli_not = true;
            this.toastHelper.show({message: 'Notificação enviada!', cssClass: 'toast-success'});
          } else {
            this.toastHelper.show({message: 'Erro: notificação não enviada.', cssClass: 'toast-error'});
          }
          this.setItemLoading(item, false);
          if (resp.address) {
            this.askOpenDispatchRoute(resp.address, item);
          }
        }, () => {
          this.setItemLoading(item, false);
          this.toastHelper.connectionError();
        });
    });
  }

  askOpenDispatchRoute(address: Address, item: DispatchOrderAdminList) {
    this.alertHelper.confirm(
      `Traçar rota?`,
      'Deseja traçar a rota até o cliente?',
      'Sim',
      'Não',
    ).then((confirmed) => {
      if (!confirmed) {
        return;
      }
      let options: LaunchNavigatorOptions = {
        errorCallback: (e) => {
          console.error(e);
          this.toastHelper.show({message: 'Não foi possível abrir a rota.', cssClass: 'toast-error'});
        }
      };
      const point: Point = address.point;
      this.launchNavigator.navigate([point.lat, point.lng], options)
        .then(
          success => {
            this.goToDetail(item.id);
          },
          error => {
            options.errorCallback(error);
          }
        );
    });
  }

  executeToggleIsClosed(item: DispatchOrderAdminList) {
    const has_plm = item.has_plm;
    this.setItemLoading(item);
    this.adminStoreService.toggleDispatchClosed(item.id, !item.is_clo)
      .subscribe(() => {
        if (has_plm) {
          item.has_plm = false;
          if (!item.is_clo) {
            this.alertHelper.confirm(
              `Feito! Defeja marcar o pedido como concluído também?`,
              `${item.c_name}`,
              'Marcar como concluído',
              'Não',
              'alert-confirm-close-dispatch'
            ).then((confirmed) => {
              if (!confirmed) {
                this.listItemUpdated.emit();
                this.setItemLoading(item, false);
                return;
              }
              this.executeToggleIsClosed(item)
            }).catch(() => {
              this.listItemUpdated.emit();
              this.setItemLoading(item, false);
            });
          } else {
            this.listItemUpdated.emit();
            this.setItemLoading(item, false);
          }
        } else {
          item.is_clo = !item.is_clo;
          this.listItemUpdated.emit();
          this.setItemLoading(item, false);
        }
      }, () => {
        this.setItemLoading(item, false);
        this.toastHelper.connectionError();
      });

  }

  toggleIsClosed(item: DispatchOrderAdminList) {
    this.alertHelper.confirm(
      `Confirmar ${item.has_plm ? 'problema resolvido' : (item.is_clo ? 'retorno' : 'entrega')}`,
      `${item.c_name}`,
      'Confirmar',
      'Cancelar',
      'alert-confirm-close-dispatch'
    ).then((confirmed) => {
      if (!confirmed) {
        return;
      }
      this.executeToggleIsClosed(item)
    });
  }

  setItemLoading(item: DispatchOrderAdminList, isLoading = true) {
    if (isLoading) {
      if (!this.isLoading(item)) {
        this.loadingIds.push(item.id);
      }
    } else {
      const index = this.loadingIds.indexOf(item.id);
      if (index > -1) {
        this.loadingIds.splice(index, 1);
      }
    }
  }

  isLoading(item: DispatchOrderAdminList) {
    return this.loadingIds.indexOf(item.id) !== -1;
  }

  get canChangeDeliveryEmployee() {
    return Utils.isAdminOrStoreSeller(this.user, this.store);
  }

}
