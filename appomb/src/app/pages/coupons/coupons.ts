import { Component, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CouponInvalidError, CouponsService, CouponUserRegister } from '../../providers/coupons.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { AppConfig } from '../../../configs';
import { ToastHelper } from '../../utils/toast-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { IUserSettings } from '../../shared/interfaces';
import { SettingsService } from '../../providers/settings-service';
import { Store } from '../../shared/models/store.model';
import { EventService } from '../../providers/event.service';
import { Router } from '@angular/router';


@Component({
  selector: 'page-coupons',
  templateUrl: './coupons.html',
  styleUrl: './coupons.scss',
})
export class CouponsPage implements OnDestroy {
  items: CouponUserRegister[];
  couponsInvalids: CouponInvalidError[] = [];
  store: Store;

  constructor(
    private navCtrl: NavController,
    private appConfig: AppConfig,
    private loadingHelper: LoadingHelper,
    private toastHelper: ToastHelper,
    private events: EventService,
    private alertHelper: AlertHelper,
    private couponsService: CouponsService,
    private settingsService: SettingsService,
    private router: Router) {

  }

  ionViewDidLoad() {
    this.settingsService.getSettings()
      .then((result: IUserSettings) => {
        this.store = result.store;
        this.loadCoupons(result.store);
      });
    this.events.onEvent('loadCouponsList').subscribe(this.loadCouponsEvent);
    
  }

  ngOnDestroy(): void {
    this.events.onEvent('loadCouponsList').subscribe(this.loadCouponsEvent)
  }

  loadCouponsEvent = () => {
    if (this.store) {
      this.loadCoupons(this.store);
    }
  };

  isInvalid(id: number) {
    return this.invalidIds.indexOf(id) !== -1;
  }

  get invalidIds() {
    return this.couponsInvalids.map((i) => i.id);
  }

  getCouponError(id: number) {
    return this.couponsInvalids.find(i => i.id === id)
  }

  gerCouponErrorMessage(id: number) {
    const error = this.getCouponError(id);
    if (!error) {
      return 'cupom inválido no momento, verifique as regras.'
    }
    return error.reason_detail;
  }

  loadCoupons(store: Store): void {
    this.loadingHelper.setLoading('coupons', true);
  
    this.couponsService.getActives(store.id).subscribe({
      next: (resp) => {
        this.loadingHelper.setLoading('coupons', false);
  
        if (resp.count) {
          this.items = resp.coupons;
          this.couponsInvalids = resp.invalid_coupons;
        } else {
          this.items = null;
        }
      },
      error: () => {
        this.loadingHelper.setLoading('coupons', false);
        this.toastHelper.connectionError();
      }
    });
  }

  delete(id: any) {
    this.alertHelper.confirm('Remover cupom', 'Deseja remover esse cupom da sua conta?')
      .then((confirmed) => {
        if (confirmed) {
          this.sendDelete(id);
        }
      })
  }  

  sendDelete(id: any) {
    this.loadingHelper.show();
    this.couponsService.delete(id)
      .subscribe(() => {
        this.events.emitEvent('couponDeleted');
        this.loadingHelper.hide();
        this.loadCoupons(this.store);
      }, () => {
        this.toastHelper.connectionError();
        this.loadingHelper.hide();
      })
  }

  get loadingCoupons() {
    return this.loadingHelper.isLoading('coupons');
  }

  goToRegister() {
    this.router.navigate(['/CouponsRegisterPage']);
  }

}
