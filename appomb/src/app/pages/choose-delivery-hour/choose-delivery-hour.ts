import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonContent,
  ModalController,
  Platform,
  IonHeader,
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DeliveryHourSimple,
  UserAddressProvider,
} from '../../providers/user-address/user-address';
import { AuthService } from '../../providers/auth-service';
import { DeliveryState } from '../../providers/delivery-state/delivery-state';
import { Utils } from '../../utils/utils';
import { ToastHelper } from '../../utils/toast-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { deliveryHourToDate } from '../checkout-complete/checkout-complete';
import { Location } from '@angular/common';

@Component({
  selector: 'app-choose-delivery-hour',
  templateUrl: './choose-delivery-hour.html',
  styleUrls: ['./choose-delivery-hour.scss'],
})
export class ChooseDeliveryHourPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;
  @ViewChild(IonHeader, { static: false }) header: IonHeader | undefined;

  items: DeliveryHourSimple[] = [];
  goToAfter: string | undefined;
  possibleDeliveryHour: any;
  redirectType: string | undefined;
  onCancel: (() => void) | undefined;
  onSelect: ((deliveryHour: DeliveryHourSimple) => void) | undefined;

  constructor(
    private userAddressProvider: UserAddressProvider,
    private deliveryState: DeliveryState,
    private toastHelper: ToastHelper,
    private loadingHelper: LoadingHelper,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private platform: Platform,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pegando parâmetros da rota
    const params = this.route.snapshot.queryParams;

    try {
      // Tenta converter a string JSON em array de objetos
      this.items = JSON.parse(params['items']) || [];
    } catch (e) {
      console.error('Erro ao fazer parse de items:', e);
      this.items = [];
    }

    console.log('Items:', this.items);

    this.goToAfter = params['goToAfter'];

    this.possibleDeliveryHour = params['possibleDeliveryHour'];

    this.redirectType = params['redirectType'];

    this.onCancel = params['onCancel'];
    this.onSelect = params['onSelect'];

    if (this.possibleDeliveryHour) {
      this.processDeliveryHours();
    }
  }

  private processDeliveryHours() {
    const data = Utils.copy(this.items);
    const dateLimit = deliveryHourToDate(this.possibleDeliveryHour.start_hour);

    data.forEach((deliveryHourSimple: DeliveryHourSimple) => {
      const hour = deliveryHourToDate(deliveryHourSimple.start_hour);
      if (hour < dateLimit) {
        deliveryHourSimple.is_before_next_batch = true;
      }
    });

    this.items = data;
  }

  async redirectToAfterPage(): Promise<void> {
    if (!this.redirectType || this.redirectType === 'push') {
      await this.router.navigate([this.goToAfter]);
    } else {
      await this.router.navigateByUrl(this.goToAfter || '');
    }
  }

  async select(deliveryHour: DeliveryHourSimple): Promise<void> {
    console.log('select', deliveryHour);
    let errorMessage = '';

    if (deliveryHour.is_past) {
      errorMessage = 'Escolha um horário futuro.';
    } else if (deliveryHour.is_full) {
      errorMessage = 'Horário atingiu a capacidade de entregas.';
    } else if (deliveryHour.is_before_next_batch) {
      const values = Utils.extractHourPartsFromJsonHour(
        this.possibleDeliveryHour.start_hour
      );
      if (values) {
        const dtString = `${values.hour}:${values.minute}`;
        errorMessage = `Um dos produtos escolhidos só estará disponível a partir de ${dtString}.`;
      } else {
        errorMessage = `Um dos produtos escolhidos só estará disponível após esse horário.`;
      }
    }

    if (errorMessage) {
      this.toastHelper.show({ message: errorMessage });
      return;
    }

    this.deliveryState.deliveryHour = deliveryHour;
    this.executeOnSelectCallback(deliveryHour);
    await this.afterSelect();
  }

  executeOnSelectCallback(deliveryHour: DeliveryHourSimple): void {
    if (this.onSelect && Utils.isFunction(this.onSelect)) {
      this.onSelect(deliveryHour);
      this.onSelect = null;
    }
  }

  async afterSelect(): Promise<void> {
    if (this.goToAfter) {
      
      await this.redirectToAfterPage();
    } else {
      console.log(this.goToAfter);
      //MUDAMOS PARA CHECKOUTCOMPLETE
      // this.router.navigate(['CheckoutComplete'], { relativeTo: this.route });
      this.router.navigate(['CheckoutComplete']);
    }
  }

  executeOnCancelCallback(): void {
    if (this.onCancel && Utils.isFunction(this.onCancel)) {
      this.onCancel();
      this.onCancel = null;
    }
  }
}
