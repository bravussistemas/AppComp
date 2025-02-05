import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AlertHelper } from '../../utils/alert-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { Utils } from '../../utils/utils';
import { UserProfileService } from '../../providers/user-profile.service';
import { AppConfig } from '../../../configs';
import { SettingsService } from '../../providers/settings-service';
import { ToastHelper } from '../../utils/toast-helper';
import { StoreService } from '../../providers/store-service';
import { IUserSettings } from '../../shared/interfaces';
import { Store } from '../../shared/models/store.model';
import * as moment from 'moment';
import { EventService } from 'src/app/providers/event.service';

declare let $: any;

@Component({
  selector: 'page-choose-schedule-delivery-date',
  templateUrl: 'choose-schedule-delivery-date.html',
})
export class ChooseScheduleDeliveryDate {

  form: FormGroup;

  dataForm: {
    date: string;
    observation: string;
  };

  formErrors: FormErrors;
  store: Store;
  days: string[];
  today: string;
  tomorrow: string;

  constructor(public fb: FormBuilder,
              private toastHelper: ToastHelper,
              private userProfileService: UserProfileService,
              private settingsService: SettingsService,
              private alertHelper: AlertHelper,
              private appConfig: AppConfig,
              public storeService: StoreService,
              private events: EventService,
              protected loadingHelper: LoadingHelper,
              private router: Router,
              private route: ActivatedRoute) {

    let date = route.snapshot.paramMap.get('date') || '';
    if (!isNaN(Date.parse(date))) {
      // A string é uma data válida
      date = moment(new Date(date)).format('YYYY-MM-DD');
    } 

    this.dataForm = {
      date,
      observation: route.snapshot.paramMap.get('observation') || '',
    };
    this.buildForm();
  }

  ionViewDidLoad() {
    this.loadingHelper.setLoading('getStoreNextValidOpenedDays', true);
    this.settingsService.getSettings()
      .then((result: IUserSettings) => {
        this.store = result.store;
        this.loadDays(result.store);
      });
  }

  loadDays(store: Store) {
    this.storeService.getStoreNextValidOpenedDays(store.id).subscribe(resp => {
      this.loadingHelper.setLoading('getStoreNextValidOpenedDays', false);
      this.days = resp.days;
      this.today = resp.today;
      this.tomorrow = resp.tomorrow;
    }, () => {
      this.loadingHelper.setLoading('getStoreNextValidOpenedDays', false);
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      'date': [this.dataForm.date, [Validators.required]],
      'observation': [this.dataForm.observation],
    });
    this.formErrors = new FormErrors(this.form, this.validationMessages);
  }

  validationMessages = {
    'date': {},
    'observation': {},
  };

  submitForm() {
    this.formErrors.setSubmitted();
  
    if (this.form.valid) {
      // Publica o evento usando EventService
      this.events.emitEvent('scheduleDeliveryDateChanged', {
        date: moment(this.form.value.date).toDate(),
        observation: this.form.value.observation
      });
  
      // Navega de volta para a página anterior
      setTimeout(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    }
  }

}
