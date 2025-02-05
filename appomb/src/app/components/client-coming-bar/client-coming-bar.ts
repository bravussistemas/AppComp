import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SalesService } from '../../providers/sales.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../providers/settings-service';
import { IUserSettings } from '../../shared/interfaces';
import { Store } from '../../shared/models/store.model';
import { ToastHelper } from '../../utils/toast-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { IStoreOperatingHour, Utils } from '../../utils/utils';

@Component({
  selector: 'client-coming-bar',
  templateUrl: './client-coming-bar.html',
  styleUrl: './client-coming-bar.scss'
})

export class ClientComingBar implements OnInit {
  @Output() clientComingInformed: EventEmitter<any> = new EventEmitter<any>();
  store: Store;
  clientIsComing = false;

  constructor(private salesService: SalesService,
              protected loadingHelper: LoadingHelper,
              private toastHelper: ToastHelper,
              private alertHelper: AlertHelper,
              private trans: TranslateService,
              private settingsService: SettingsService) {

  }

  ngOnInit() {
    this.loadingHelper.setLoading('isComing', true);
    this.settingsService.getSettings()
      .then((result: IUserSettings) => {
        this.store = result.store;
        this.salesService.isClientComing(this.store.id).then((isComing) => {
          this.clientIsComing = isComing;
          this.loadingHelper.setLoading('isComing', false);
        });
      });
  }

  showStoreClosedPopup() {
    let storeWorkTime: IStoreOperatingHour = Utils.extractOpenAndCloseStore(this.store);
    let periodGetText = 'no horário de funcionamento';
    if (!Utils.isNullOrUndefined(storeWorkTime) && !Utils.isObjectEmpty(storeWorkTime)) {
      if (storeWorkTime.openAt && storeWorkTime.closeAt) {
        periodGetText = `entre ${storeWorkTime.openAt}h e 
                    ${storeWorkTime.closeAt}h`;
      } else if (storeWorkTime.openAt) {
        periodGetText = `a partir de ${storeWorkTime.openAt}h`;
      } else if (storeWorkTime.closeAt) {
        periodGetText = `até às ${storeWorkTime.closeAt}h`;
      }
    }
    let msg = `Por favor, informar sua chegada ${periodGetText}.`;
    this.alertHelper.show('A loja não está aberta no momento', msg);
  }

  onComing() {
    this.loadingHelper.setLoading('isComing', true);
    this.salesService.toggleClientIsComing(this.store.id)
      .subscribe((resp) => {
        this.loadingHelper.setLoading('isComing', false);
        if (resp.store_is_open === false) {
          this.clientIsComing = false;
          this.showStoreClosedPopup();
          return;
        }
        this.clientIsComing = resp.is_client_coming;
        if (resp.is_client_coming) {
          this.clientComingInformed.emit();
          this.trans.get('THANKS_COMING_TOAST').subscribe((val) => {
            this.toastHelper.show({message: val, duration: 3000, position: 'middle', cssClass: 'toast-custom-white'});
          });
        }
      }, () => {
        this.handlerError();
      });
  }

  handlerError() {
    this.clientIsComing = !this.clientIsComing;
    this.trans.get('ERROR_REQUEST').subscribe((val) => {
      this.loadingHelper.setLoading('isComing', false);
      this.alertHelper.show(val);
    });
  }
}
