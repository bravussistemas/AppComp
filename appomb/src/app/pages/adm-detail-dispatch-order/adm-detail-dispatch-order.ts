import { Component, Renderer2, ViewChild } from '@angular/core';
import { IonContent, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DispatchOrderService } from '../../providers/dispatch-order.service';
import { DispatchOrder } from '../../shared/models/dispatch-order.model';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { AdminStoreService } from '../../providers/admin-store.service';
import { Utils } from '../../utils/utils';
import { AuthService } from '../../providers/auth-service';
import { User } from '../../shared/models/user.model';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { Address, Point } from '../../shared/models/address.model';
import { Store } from '../../shared/models/store.model';
import { IUserSettings } from '../../shared/interfaces';
import { SettingsService } from '../../providers/settings-service';
declare let cordova: any;

@Component({
  selector: 'page-adm-detail-dispatch-order',
  templateUrl: './adm-detail-dispatch-order.html',
  styleUrls: ['./adm-detail-dispatch-order.scss'],
})
export class AdmDetailDispatchOrderPage {
  id: number;
  item: DispatchOrder;
  user: User;
  store: Store;
  @ViewChild('rootContent') rootContent: IonContent;

  constructor(public navCtrl: NavController,
              public platform: Platform,
              private dispatchOrderService: DispatchOrderService,
              protected loadingHelper: LoadingHelper,
              private adminStoreService: AdminStoreService,
              private toastHelper: ToastHelper,
              public auth: AuthService,
              private renderer: Renderer2,
              private settingsService: SettingsService,
              private launchNavigator: LaunchNavigator,
              private route: ActivatedRoute,
              private router: Router) {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
  }

  ionViewDidLoad() {
    this.settingsService.getSettings()
      .then((result: IUserSettings) => {
        this.store = result.store;
        this.load();
      });
  }

  canChargeBack() {
    if (!this.item || !this.item.id) {
      return false;
    }
    if (this.item.is_reversed) {
      return false;
    }
    return this.user && this.canAdminStore(this.user, this.store);
  }

  load() {
    this.loadingHelper.setLoading('dispatchOrder', true);
    this.auth.getUser().then((user) => {
      this.user = user;
      this.dispatchOrderService.get(this.id).subscribe(
        (resp) => {
          this.setItem(resp);
          try {
            if (this.canChargeBack() && this.rootContent) {
              const nativeElement = this.rootContent.getScrollElement(); // Obtenha o elemento de rolagem
              this.renderer.addClass(nativeElement, 'content-with-bottom-bar');
            }
          } catch (e) {
            console.error(e);
          }
          this.loadingHelper.setLoading('dispatchOrder', false);
        },
        (e) => {
          console.error(e);
          this.toastHelper.show({ message: `Erro ao recuperar ordem de serviço: ${this.id}`, cssClass: 'toast-error' });
          this.loadingHelper.setLoading('dispatchOrder', false);
        }
      );
    });
  }

  launchMapsWithRoute(e) {
    e.stopPropagation();
    let options: LaunchNavigatorOptions = {
      errorCallback: (e) => {
        console.error(e);
        this.toastHelper.show({message: 'Não foi possível abrir a rota.', cssClass: 'toast-error'});
      }
    };
    const address: Address = this.item.address;
    const addressFirstPart = [address.street, address.number, address.complement].filter(i => i).join(', ');
    const addressSecondPart = [address.district, address.state_label].filter(i => i).join(' - ');
    const addressParts = [addressFirstPart, addressSecondPart].filter(i => i).join(' - ');
    this.launchNavigator.navigate(addressParts, options)
      .then(
        success => console.log('Launched navigator'),
        error => options.errorCallback(error)
      );
  }

  goToCancelDispatch() {
    if (this.id) {
      this.router.navigate(['/adm-dispatch-order-sales'], { queryParams: { id: this.id } });
    }
  }

  setItem(item: DispatchOrder) {
    this.item = item;
  }

  get whatsAppPhoneClient() {
    const ddd = Utils.safeAttr(this.item, 'client.profile.mobile_phone_area');
    const number = Utils.safeAttr(this.item, 'client.profile.mobile_phone');
    if (!ddd || !number) {
      return '';
    }
    return `+55${ddd}${number}`;
  }

  get phoneClientLink() {
    return `tel:${this.whatsAppPhoneClient}`;
  }

  get whatsAppLink() {
    return `whatsapp://send?phone=${this.whatsAppPhoneClient}&abid=${this.whatsAppPhoneClient}`;
  }

  openWhats() {
    if(!this.platform.is('cordova'))
      window.open(this.whatsAppLink, '_system')
    else
      cordova.InAppBrowser.open(this.whatsAppLink, '_system', 'location=yes');
    
  }

  toggleIsClosed() {
    if (!this.item) {
      return;
    }
    this.loadingHelper.show();
    this.adminStoreService.toggleDispatchClosed(this.item.id, !this.item.is_closed)
      .subscribe(() => {
        this.navCtrl.pop();
        this.loadingHelper.hide();
      }, () => {
        this.toastHelper.show({message: `Erro finalizar ordem de serviço: ${this.id}`, cssClass: 'toast-error'});
      });
  }

  canAdminStore(user: User, store: Store) {
    return Utils.canAdminStore(user, store)
  }
}
