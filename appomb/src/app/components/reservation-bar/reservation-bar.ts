import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { CartManagerTable } from '../../providers/database/cart-manager-table';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../providers/auth-service';
import { Storage } from '@ionic/storage';
import { DeliveryState } from '../../providers/delivery-state/delivery-state';
import { Utils } from '../../utils/utils';
import { DeliveryMethod } from '../../shared/interfaces';
import { AppConfig } from '../../../configs';
import { EventService } from 'src/app/providers/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'reservation-bar',
  templateUrl: 'reservation-bar.html'
})
export class ReservationBar implements OnInit, OnDestroy {




  units: number = 0;
  total: number = 0;
  updating = false;
  subtitle: string;
  @Input() canGoCheckout = () => true;

  constructor(private element: ElementRef,
              private renderer: Renderer2,
              private deliveryState: DeliveryState,
              private cartManagerTable: CartManagerTable,
              private appConfig: AppConfig,
              private authService: AuthService,
              private storage: Storage,
              private events: EventService,
              private navCtrl: NavController,
              private router: Router) {

  }

  ngOnInit() {
    this.units = 0;
    this.total = 0;
    this.startUpdating();
    this.deliveryState.state$.subscribe((deliveryState) => {
      if (deliveryState) {
        let text = '';
        if (deliveryState.method) {
          if (deliveryState.method === DeliveryMethod.DELIVERY_METHOD_HOUSE) {
            text = this.appConfig.DELIVERY_LABEL;
            if (deliveryState.address && deliveryState.address.simple_address) {
              text += `: ${deliveryState.address.simple_address}`;
            }
          } else {
            text = this.appConfig.STORE_LABEL;
            if (deliveryState.store && deliveryState.store.address && deliveryState.store.address.simple_address) {
              text += `: ${deliveryState.store.address.simple_address}`;
            }
          }
        }
        if (text && text.length) {
          this.subtitle = text;
        }
      }
    })
  }

  startUpdating() {
    this.updateReservationInfo();
    this.cartManagerTable.init()
      .then(() => {
        this.events.onEvent('cartChanged').subscribe(this.updateReservationInfo);
      });
  }

  ngOnDestroy() {
    this.events.unsubscribe('cartChanged');
  }

  updateReservationInfo = () => { // Ionic Events requires arrow functions to make right unsubscribe
    if (this.updating) {
      return;
    }
    this.updating = true;
    this.cartManagerTable.getCartInfo()
      .then((data) => {
        this.units = data.countItems;
        this.total = data.totalToPay;
        this.updating = false;
      })
      .catch(() => {
        this.updating = false;
      });
  };

  goToCheckout() {
    // if (this.units) {
    if (!this.canGoCheckout()) {
      return;
    }
    this.authService.loggedIn()
      .then((loggedIn) => {
        if (loggedIn) {
          return this.router.navigate(['/CheckoutComplete']);
        } else {
          this.storage.set('GO_TO_AFTER_LOGIN', 'CheckoutComplete');
          return this.router.navigate(['/Login']);
        }
      });
    // }
  }

}
