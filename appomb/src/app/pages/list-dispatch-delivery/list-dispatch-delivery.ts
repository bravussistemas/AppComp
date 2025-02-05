import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DateService } from '../../providers/date-service';
import { Store } from '../../shared/models/store.model';
import { IUserSettings } from '../../shared/interfaces';
import { AuthService } from '../../providers/auth-service';
import { SettingsService } from '../../providers/settings-service';
import { CartManagerTable } from '../../providers/database/cart-manager-table';
import { User } from '../../shared/models/user.model';
import { DispatchOrderAdminList } from '../../shared/models/dispatch-order.model';
import { LoadingHelper } from 'src/app/utils/loading-helper';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'page-list-dispatch-delivery',
  templateUrl: './list-dispatch-delivery.html',
  styleUrl: './list-dispatch-delivery.scss',
})
export class ListDispatchDeliveryPage implements OnInit {
  dataDispatchOrders: any;
  day: moment.Moment = this.dateService.today();
  store: Store;
  user: User;

  constructor(
    public navCtrl: NavController,
    private dateService: DateService,
    private authService: AuthService,
    private settingsService: SettingsService,
    private cartManagerTable: CartManagerTable,
    private router: Router,
    protected loadingHelper: LoadingHelper,
  ) {}

  ngOnInit(): void {
    this.initializePage();
  }

  mapListOnlyEmployee = (items: DispatchOrderAdminList[]): DispatchOrderAdminList[] => {
    return items.filter((item) => item.del_emp_id === this.user?.delivery_employee_id);
  };

  private async initializePage(): Promise<void> {
    try {
      // Inicializar o gerenciador de carrinho
      await this.cartManagerTable.init();

      // Obter usuário autenticado
      const user = await this.authService.getUser();

      if (!user || !user.delivery_employee_id) {
        // Redirecionar se não for entregador
        this.router.navigateByUrl('/HomePage');
        return;
      }

      this.user = user;

      // Configurar a loja e dados
      const settings = await this.settingsService.getSettings();
      if (settings && settings.store) {
        this.setStore(settings.store);
      } else {
        console.error('Configuração da loja não encontrada.');
        this.router.navigateByUrl('/HomePage');
      }
    } catch (error) {
      console.error('Erro ao inicializar a página:', error);
      this.router.navigateByUrl('/HomePage');
    }
  }

  private setDay(day: moment.Moment): void {
    if (!day) {
      console.warn('Dia inválido fornecido.');
      return;
    }

    this.day = day;
    this.dataDispatchOrders = { day: this.day, store: this.store };
  }

  private setStore(store: Store): void {
    if (!store) {
      console.warn('Loja inválida fornecida.');
      return;
    }

    this.store = store;
    this.setDay(this.day);
  }
}
