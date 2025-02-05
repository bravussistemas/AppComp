import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonInput } from '@ionic/angular'; // Substitui o TextInput
import { ActivatedRoute, Router } from '@angular/router'; // Substitui NavParams
import { UserCreditService } from '../../providers/user-credit.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { IUserSettings } from '../../shared/interfaces';
import { SettingsService } from '../../providers/settings-service';
import { Store } from '../../shared/models/store.model';
import { AdminStoreService } from '../../providers/admin-store.service';

declare let $: any;

@Component({
  selector: 'page-adm-detail-user-credits',
  templateUrl: './adm-detail-user-credits.html',
  styleUrls: ['./adm-detail-user-credits.scss'],
})

export class AdmDetailUserCreditsPage implements OnInit {
  segment = 'add';
  userId = parseInt(this.route.snapshot.paramMap.get('userId'));
  data: any = {};
  store: Store;
  @ViewChild('inputCredit', { static: false }) inputCredit: IonInput;

  constructor(private settingsService: SettingsService,
              public loadingHelper: LoadingHelper,
              public userCreditService: UserCreditService,
              public adminStoreService: AdminStoreService,
              public toastHelper: ToastHelper,
              public route: ActivatedRoute,
              public router: Router) {
  }

  ionViewDidLoad() {

  }

  addCredit() {
    this.loadingHelper.show();
    this.userCreditService.addCredit({
      userId: this.userId,
      amount: this.inputCredit.value,
      storeId: this.store.id,
    }).subscribe(() => {
      this.loadingHelper.hide();
      this.loadDetail();
    }, (e) => {
      this.handlerError(e);
      this.loadingHelper.hide();
    })
  }
  
  canSendAddCredit() {
    if (!this.inputCredit || !this.inputCredit.value) {
      return false;
    }
    try {
      return parseInt(String(this.inputCredit.value), 10) > 0; // Converte explicitamente para string
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  changeValue(event) {
    if (event.value === 'R$ ') {
      this.inputCredit.value = '';
    }
  }

  deleteCredit(credit) {
    credit._deleting = true;
    this.userCreditService.remove({
      userId: this.userId,
      creditId: credit.id,
    }).subscribe(() => {
      this.data.user.credit_missing -= credit.missing_use;
      credit._hidden = true;
    }, (e) => {
      console.error(e);
      credit._deleting = false;
      this.handlerError(e);
    })
  }

  setFocus() {
    setTimeout(() => {
      if (this.segment === 'add') {
        $('#inputCredit input').mask('000');
        this.inputCredit.setFocus();
      }
    }, 400);
  }

  segmentChanged(event) {
    if (event.value === 'add') {
      this.setFocus();
    }
  }

  ngOnInit() {
    this.loadDetail();
  }

  loadDetail() {
    this.loadingHelper.setLoading('detailCredit', true);
    this.settingsService.getSettings()
      .then((result: IUserSettings) => {
        this.store = result.store;

        this.userCreditService.detailUserCredits(this.userId).subscribe((resp) => {
          this.loadingHelper.setLoading('detailCredit', false);
          this.data = resp;
          if (this.segment === 'add') {
            this.setFocus();
          }
        }, (e) => {
          this.handlerError(e);
        })
      }, this.handlerError.bind(this));
  }

  handlerError(error) {
    console.error(error);
    this.loadingHelper.setLoading('detailCredit', false);
    this.toastHelper.show({message: 'Ocorreu um erro sua requisição, verifique sua conexão.', cssClass: 'toast-error'});
  }
}
