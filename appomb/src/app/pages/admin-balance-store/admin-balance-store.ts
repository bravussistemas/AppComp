import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Store, StoreTypeEnum } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { IUserSettings } from '../../shared/interfaces';
import * as moment from 'moment';
import { DateService } from '../../providers/date-service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingHelper } from '../../utils/loading-helper';
import { AdminStoreService } from '../../providers/admin-store.service';
import { DatePipe } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../providers/auth-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

enum Sections {
  DAY,
  WEEK,
  MONTH,
}

interface UserCreditHistory {
  result_amount: number;
  type_transaction: string;
  action_amount: string;
  user_email: string;
  user_name: string;
  when: string;
}

export interface StoreBalance {
  client_credit_history: {
    items: UserCreditHistory[];
  };
  gross_value: {
    card: number;
    client_credit: number;
    money: number;
    total: number;
  };
  money_result: {
    money: number;
    client_credit: number;
    total: number;
    ra: number;
    fl: number;
  };
  product_type_balance: {
    sum_sale_main: number;
    sum_sale_secondary: number;
    sum_sale_main_percent: number;
    sum_sale_secondary_percent: number;
  };
  net_value: {
    card: number;
    client_credit: number;
    money: number;
    total: number;
  };
  net_value_v2: {
    f: number;
    ra: number;
    c: number;
    i: number;
    total: number;
  };
}

@Component({
  selector: 'page-admin-balance-store',
  templateUrl: './admin-balance-store.html',
  styleUrls: ['./admin-balance-store.scss'],
})
export class AdminBalanceStorePage implements OnInit {
  store: Store;
  user: User;
  section = Sections.DAY;
  sections = Sections;
  day: moment.Moment = this.date.today();
  dayEnd: moment.Moment = this.date.today();
  todayTxt: string;
  storeBalance: StoreBalance;
  page = 0;
  form: FormGroup;
  employeIdFilter: number;
  storeBalanceContent: string = '';
  clientCreditHistory: UserCreditHistory[] = [];
  deliveryEmployees: any[] = [];

  constructor(
    public navCtrl: NavController,
    private settingsService: SettingsService,
    private authService: AuthService,
    private date: DateService,
    public fb: FormBuilder,
    public loadingHelper: LoadingHelper,
    private datePipe: DatePipe,
    public adminStoreService: AdminStoreService,
    private trans: TranslateService,
    private sanitizer: DomSanitizer
  ) {
    this.trans.get('TODAY').subscribe((val) => (this.todayTxt = val));
  }

  ionViewDidLoad() {}

  employeeChange(event) {
    console.log(event);
  }

  getPeriodType() {
    switch (this.section) {
      case Sections.DAY:
        return 'day';
      case Sections.WEEK:
        return 'week';
      case Sections.MONTH:
        return 'month';
    }
  }

  parseAction(actionName: string) {
    switch (actionName) {
      case 'credit_added':
        return 'adicionou';
      case 'credit_removed':
        return 'resgatou';
      case 'credit_user':
        return 'utilizou';
    }
  }

  parseActionColor(actionName: string) {
    switch (actionName) {
      case 'credit_added':
        return 'red';
      case 'credit_removed':
        return 'green';
      case 'credit_user':
        return 'green';
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      delivery_employee: [''],
    });
    this.form.get('delivery_employee').valueChanges.subscribe((v) => {
      console.log('Está aqui, ', v);
      
      this.employeIdFilter = v;
      this.loadBalance();
    });
    // this.loadBalance();
  }

  canChooseEmployee() {
    return (
      this.user &&
      this.store &&
      (this.user.is_staff || this.user.is_store_seller) &&
      this.store.store_type == StoreTypeEnum.DELIVERY
    );
  }

  loadBalance() {
    this.loadingHelper.setLoading('updateBalanceDay', false);
    this.loadingHelper.setLoading('loadDeliveryEmployees', true);

    this.authService.getUser().then((user) => {
      this.user = user;
      this.settingsService.getSettings().then((result: IUserSettings) => {
        this.store = result.store;
        this.adminStoreService.listDeliveryEmployees().subscribe(
          (e: any) => {
            this.deliveryEmployees = e.delivery_employees;
            this.loadingHelper.setLoading('loadDeliveryEmployees', false);
          },
          (e) => {
            this.loadingHelper.setLoading('loadDeliveryEmployees', false);
            console.error(e);
          }
        );
        this.adminStoreService
          .balanceGeneralV2({
            store: this.store.id,
            page: this.page,
            delivery_employee: this.employeIdFilter,
            period_type: this.getPeriodType(),
          })
          .subscribe(
            (e: any) => {
              this.day = moment(e.day_start);
              this.dayEnd = moment(e.day_end);
              this.storeBalanceContent = e.store_balance_html;
              this.clientCreditHistory = e.client_credit_history.items;
              this.loadingHelper.setLoading('updateBalanceDay', false);
            },
            (e) => {
              this.loadingHelper.setLoading('updateBalanceDay', false);
              console.error(e);
            }
          );
      });
    });
  }

  get storeBalanceContentHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.storeBalanceContent);
  }

  titleDateFilter(dt: moment.Moment) {
    if (
      moment(this.date.today(), 'DD-MM-YYYY').isSame(moment(dt, 'DD-MM-YYYY'))
    ) {
      return this.todayTxt || '';
    }
    return dt.format('dddd');
  }

  setDay(day: moment.Moment) {
    if (!day) {
      return;
    }
    this.day = day;
  }

  getDateLabel() {
    switch (this.section) {
      case Sections.DAY:
        return `<strong>${this.titleDateFilter(
          this.day
        )}</strong>, ${this.datePipe.transform(
          this.day.toDate(),
          'shortDate'
        )}`;
      default:
        return `${this.datePipe.transform(
          this.day.toDate(),
          'shortDate'
        )} - ${this.datePipe.transform(this.dayEnd.toDate(), 'shortDate')}`;
    }
  }

  headerBtnClick() {
    this.loadBalance();
  }

  onSegmentChanged(segmentButton) {
    this.page = 0;
    this.loadBalance();
  }

  prevDay() {
    this.page -= 1;
    this.loadBalance();
  }

  nextDay() {
    this.page += 1;
    this.loadBalance();
  }
}
