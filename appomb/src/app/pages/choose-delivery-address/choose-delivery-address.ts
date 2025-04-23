import { AddAddressPage } from './../add-address/add-address';

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  IonContent,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UserAddressProvider,
  UserAddress,
} from '../../providers/user-address/user-address';
import { AuthService } from '../../providers/auth-service';
import { DeliveryState } from '../../providers/delivery-state/delivery-state';
import { DeliveryMethod } from '../../shared/interfaces';
import { Utils } from '../../utils/utils';
import { ToastHelper } from '../../utils/toast-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { SettingsService } from '../../providers/settings-service';
import { LastRequestService } from '../../providers/last-request-service';
import { Store } from '../../shared/models/store.model';
import { AddAddressSimplePage } from '../add-address-simple/add-address-simple';

@Component({
  selector: 'app-choose-delivery-address',
  templateUrl: './choose-delivery-address.html',
  styleUrls: ['./choose-delivery-address.scss'],
})
export class ChooseDeliveryAddressPage
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(IonContent, { static: false }) content: IonContent;

  @ViewChild('header', { static: false, read: ElementRef })
  headerRef: ElementRef;

  headerEl: HTMLElement;

  addressAcceptableList: UserAddress[] = [];
  addressNotAcceptableList: UserAddress[] = [];
  goToAfter: string | undefined;
  redirectType: string | undefined;
  onCancel: Function | undefined;
  onSelect: Function | undefined;
  userAddressId: number | undefined;
  showHideBackButtonClass = false;
  isLoadingAddressList = false;

  private unregisterBackButtonAction: any;

  constructor(
    public navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    public userAddressProvider: UserAddressProvider,
    private settingsService: SettingsService,
    private lastRequestService: LastRequestService,
    public deliveryState: DeliveryState,
    public toastHelper: ToastHelper,
    public loadingHelper: LoadingHelper,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public platform: Platform,
    private cdr: ChangeDetectorRef
  ) {}

  get hasAddress() {
    const allAddress = this.getAllAddressList();
    return allAddress && allAddress.length > 0;
  }

  getAllAddressList(): UserAddress[] {
    return [...this.addressAcceptableList, ...this.addressNotAcceptableList];
  }

  trackByFn(index, item: UserAddress) {
    return index;
  }

  onSelectAddress(address: UserAddress) {
    if (!this.isValidSelectAddress(this.addressAcceptableList, address)) {
      this.toastHelper.show({
        message: 'A loja escolhida não oferece cobertura para este endereço.',
      });
      return;
    }
    this.selectAddress(address);
  }

  onDeleteAddress(address: UserAddress) {
    this.addressAcceptableList = this.addressAcceptableList.filter(
      (addr) => addr.id !== address.id
    );
    this.addressNotAcceptableList = this.addressNotAcceptableList.filter(
      (addr) => addr.id !== address.id
    );
  }

  ngAfterViewInit() {
    this.headerEl = this.headerRef.nativeElement;
  }

  ngOnInit(): void {
    this.goToAfter =
      this.route.snapshot.queryParamMap.get('goToAfter') || undefined;
    this.redirectType =
      this.route.snapshot.queryParamMap.get('redirectType') || undefined;
    this.userAddressId =
      Number(this.route.snapshot.queryParamMap.get('userAddressId')) ||
      undefined;
    this.load();
    this.initializeBackButtonCustomHandler();
  }

  ngOnDestroy(): void {
    if (this.unregisterBackButtonAction) {
      this.unregisterBackButtonAction.unsubscribe();
    }
  }

  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction =
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.router.navigate(['/previous-page']); // Substitua '/previous-page' pela rota anterior.
        this.executeOnCancelCallback();
      });
  }

  executeOnCancelCallback(): void {
    if (this.onCancel && Utils.isFunction(this.onCancel)) {
      this.onCancel();
      this.onCancel = undefined;
    }
  }

  executeOnSelectCallback(address: UserAddress): void {
    if (this.onSelect && Utils.isFunction(this.onSelect)) {
      this.onSelect(address);
      this.onSelect = undefined;
    }
  }

  load(): void {
    this.loadAddressList(this.deliveryState.store);
  }

  loadAddressList(store: Store): void {
    this.loadingHelper.setLoading('addressList', true);
    this.isLoadingAddressList = true;
    this.cdr.detectChanges();

    this.userAddressProvider.list({ store_id: store.id.toString() }).subscribe(
      (resp) => {
        if (resp.acceptable.length && this.userAddressId) {
          const autoSelected = this.autoSelectWithId(
            resp.acceptable,
            this.userAddressId
          );
          if (autoSelected) return;
        }
        this.addressAcceptableList = resp.acceptable;
        this.addressNotAcceptableList = resp.not_acceptable;
        this.loadingHelper.setLoading('addressList', false);

        this.isLoadingAddressList = false;
        this.showHideBackButtonClass = true;
        this.cdr.detectChanges();
      },
      () => {
        this.loadingHelper.setLoading('addressList', false);
        this.isLoadingAddressList = false;
        this.cdr.detectChanges();
        this.toastHelper.connectionError();
      }
    );
  }

  autoSelectWithId(userAddressList: UserAddress[], id: number): boolean {
    const selected = userAddressList.find(
      (userAddress) => userAddress.id === id
    );
    if (selected && this.isValidSelectAddress(userAddressList, selected)) {
      this.selectAddress(selected);
      return true;
    }
    return false;
  }

  isValidSelectAddress(
    addressAcceptableList: UserAddress[],
    userAddress: UserAddress
  ): boolean {
    return addressAcceptableList.some((addr) => addr.id === userAddress.id);
  }

  selectAddress(address: UserAddress): void {
    this.deliveryState.deliveryAddress = address.address;
    this.deliveryState.deliveryMethod = DeliveryMethod.DELIVERY_METHOD_HOUSE;
    this.lastRequestService.updateSettings({
      subtitle: address.address.simple_address,
      userAddressId: address.id,
    });
    this.executeOnSelectCallback(address);
    this.redirectToAfterPage();
  }

  redirectToAfterPage(): void {
    if (this.goToAfter) {
      this.router.navigate([this.goToAfter]);
    } else {
      this.router.navigate(['/']);
    }
  }

  async addAddress(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: this.deliveryState.store.accept_delivery_by_district
        ? AddAddressSimplePage
        : AddAddressPage,
      componentProps: { goToAfter: this.goToAfter },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.user_address) {
      this.addressAcceptableList.unshift(data.user_address);
      this.selectAddress(data.user_address);
    }
  }
}
