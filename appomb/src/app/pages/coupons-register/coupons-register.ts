import { Component, ViewChild } from '@angular/core';
import { NavController, IonInput } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AppConfig } from '../../../configs';
import { LoadingHelper } from '../../utils/loading-helper';
import { CouponsService } from '../../providers/coupons.service';
import { ToastHelper } from '../../utils/toast-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { Store } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { IUserSettings } from '../../shared/interfaces';
import { EventService } from 'src/app/providers/event.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'page-coupons-register',
  templateUrl: './coupons-register.html',
  styles: './coupons-register.scss',
})
export class CouponsRegisterPage {
  form: FormGroup;
  formErrors: FormErrors;
  dataForm: { coupon: string };
  @ViewChild('input') input: IonInput;
  store: Store;

  redirectAfter;

  constructor(
    public fb: FormBuilder,
    private appConfig: AppConfig,
    private loadingHelper: LoadingHelper,
    private navCtrl: NavController,
    private toastHelper: ToastHelper,
    private events: EventService,
    private alertHelper: AlertHelper,
    private couponsService: CouponsService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
  ) {
    this.dataForm = {
      coupon: '',
    };

    this.route.queryParams.subscribe(params => {
      this.redirectAfter = params['redirectAfter'];
    })
    this.buildForm();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.input.setFocus();
    }, 500);
    this.settingsService.getSettings()
      .then((result: IUserSettings) => {
        this.store = result.store;
      });
  }

  onSubmit(valid) {
    this.formErrors.setSubmitted();
    if (!valid) {
      return;
    }
    this.loadingHelper.show('Validando cupom, aguarde...');
    this.couponsService.register({
      coupon: this.form.get('coupon').value.toString().toUpperCase(),
      storeId: this.store.id
    })
      .subscribe(
        () => {
          this.events.emitEvent('loadCouponsList');
          this.navCtrl.pop();
          this.loadingHelper.hide();
        },
        (e) => {
          this.loadingHelper.hide();
          let data = null;
          try {
            data = e
          } catch (e) {
            console.warn(e)
          }
          if (data && data.error_code == 'invalid_coupon_to_store') {
            this.alertHelper.show('Cupom não disponível para a loja atual', data.detail)
          } else if (data && data.error_code == 'already_register') {
            this.alertHelper.show(data.detail, 'Primeiro exclua o existente para poder utilizar esse.')
          } else if (e && e.status == 400) {
            this.alertHelper.show('Cupom inválido', 'Verifique o cupom digitado ou se ainda é válido')
          } else {
            this.toastHelper.connectionError();
          }
        });
  }

  buildForm(): void {
    this.form = this.fb.group({
      'coupon': [this.dataForm.coupon, [
        Validators.required
      ]],
    });
    this.formErrors = new FormErrors(this.form, this.validationMessages);
  }

  validationMessages = {
    'coupon': {
      'required': 'Digite o cupom'
    },
  };

}
