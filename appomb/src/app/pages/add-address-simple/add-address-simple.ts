import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ModalController, NavController, IonInput } from '@ionic/angular';
import { Router } from '@angular/router';
import {EventService} from '../../providers/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, District, GeoServiceProvider, State } from '../../providers/geo-service/geo-service';
import { ResultUserAddressCreated, UserAddressProvider } from '../../providers/user-address/user-address';
import { SearchStatePage } from '../search-state/search-state';
import { SearchCityPage } from '../search-city/search-city';
import { SearchDistrictPage } from '../search-district/search-district';
import { AlertHelper } from '../../utils/alert-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { FormErrors } from '../../utils/form-errors';
import { FormHelper } from '../../utils/form-helper';
import { TrackHelper } from '../../providers/track-helper/track-helper';
import { DeliveryState } from '../../providers/delivery-state/delivery-state';
import { Store } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import Swiper from 'swiper';

@Component({
  selector: 'page-add-address-simple',
  templateUrl: './add-address-simple.html',
  styleUrls: ['./add-address-simple.scss'],
})
export class AddAddressSimplePage {
  @ViewChild('slider', { static: false }) slider: Swiper;
  @ViewChild('numberInput') numberInput: IonInput;

  formAddress: FormGroup;
  formAddressErrors: FormErrors;

  selectedState: State;
  selectedCity: City;
  selectedDistrict: District;

  hasComplement = true;

  constructor(public navCtrl: NavController,
              public events: EventService,
              public alertHelper: AlertHelper,
              public loadingHelper: LoadingHelper,
              private trackHelper: TrackHelper,
              private deliveryState: DeliveryState,
              private ref: ChangeDetectorRef,
              public toastHelper: ToastHelper,
              public modalCtrl: ModalController,
              private settingsService: SettingsService,
              public userAddressProvider: UserAddressProvider,
              public geoService: GeoServiceProvider,
              public fb: FormBuilder) {
    this.buildAddressForm();
  }

  ionViewDidLoad() {
    this.init(this.deliveryState.store);
  }

  init(store: Store) {
    try {
      this.trackHelper.trackByName(TrackHelper.EVENTS.NEW_ADDRESS_START);
    } catch (e) {
      console.error(e);
    }
  }

  get stateFieldEnabled() {
    return true;
  }

  get cityFieldEnabled() {
    return this.formAddress.controls['state'].value;
  }


  get districtFieldEnabled() {
    return this.formAddress.controls['city'].value;
  }

  get streetFieldEnabled() {
    return true;
  }

  async goToChooseState() {
    if (this.formAddress.get('state')?.disabled) {
      return;
    }

    const modal = await this.modalCtrl.create({
      component: SearchStatePage, // Use your component class here
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.formAddress.get('state')?.setValue(data.abbr);
      
      if (this.selectedState && this.selectedState.id !== data.id) {
        this.selectedCity = null;
        this.formAddress.get('city')?.setValue(null);
      }
      this.selectedState = data;
    }
  }
  
  async goToChooseCity() {
    if (this.formAddress.get('city')?.disabled) {
      return;
    }

    const modal = await this.modalCtrl.create({
      component: SearchCityPage, // Use the component class here, not a string
      componentProps: { stateId: this.selectedState?.id } // Pass the stateId as a prop
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.formAddress.get('city')?.setValue(data.name);
      this.selectedCity = data;
    }
  }

  async goToChooseDistrict() {
    if (this.formAddress.get('district').disabled) {
      return;
    }    

    const modal = await this.modalCtrl.create({
      component: SearchDistrictPage, // Use the component class here, not a string
      componentProps: { stateId: this.selectedState?.id } // Pass the stateId as a prop
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.formAddress.get('district')?.setValue(data.name);
      this.selectedDistrict = data;
    }
  }
  

  buildAddressForm() {
    const COMPLEMENT_VALIDATORS = [Validators.required];
    this.formAddress = this.fb.group({
      'state': [null, [Validators.required]],
      'city': [null, [Validators.required]],
      'street': [null, [Validators.required]],
      'district': [null, [Validators.required]],
      'zipCode': [null, []],
      'number': [null, [
        Validators.required
      ]],
      'complement': [null, COMPLEMENT_VALIDATORS],
      'ref': [null, []],
      'withoutComplement': [false, []],
    });
    const formUtils = new FormHelper(this.formAddress);

    this.formAddress.get('withoutComplement').valueChanges.subscribe((val) => {
      this.hasComplement = !val;
      if (!this.hasComplement) {
        formUtils.setValidators('complement', null);
      } else {
        formUtils.setValidators('complement', COMPLEMENT_VALIDATORS);
      }
    });

    this.formAddressErrors = new FormErrors(this.formAddress, this.validationMessages);
  }

  onSubmitFormAddress(store?: Store) {
    store = store || this.deliveryState.store;
    this.formAddressErrors.setSubmitted();
    console.debug('onSubmitFormAddress', this.formAddress.valid);
    console.debug(this.formAddress.getRawValue());
    console.debug(this.formAddressErrors.getErrors());
    if (!this.formAddress.valid) {
      return;
    }
    this.loadingHelper.show();
    const data = this.formAddress.getRawValue();
    const stateId = this.selectedState ? this.selectedState.id : null;
    const cityId = this.selectedCity ? this.selectedCity.id : null;
    const districtId = this.selectedCity ? this.selectedDistrict.id : null;
    this.userAddressProvider.createSimple({
      state: stateId,
      district: districtId,
      city: cityId,
      state_abbr: data.state,
      city_name: data.city,
      street: data.street,
      district_name: data.district,
      zip_code: data.zipCode,
      number: data.number,
      complement: data.complement,
      ref: data.ref,
      without_complement: data.withoutComplement,
      store: store.id
    }).subscribe((resp: ResultUserAddressCreated) => {
      this.loadingHelper.hide();
      this.handleSuccessResponse(resp);
    });
  }

  async handleSuccessResponse(response: ResultUserAddressCreated) {
    if (!response.in_delivery_area) {
      if (response.other_store_in_area) {
        const storeName = response.other_store_in_area.name;
        this.alertHelper
          .confirm(
            'Endereço atendido por outra loja',
            `Notamos que esse endereço é atendido por outra loja (<b>${storeName}</b>). Deseja alterar a loja para continuar?`
          ).then((isConfirmed) => {
          if (isConfirmed) {
            this.settingsService.chooseStore(response.other_store_in_area)
              .then(() => {
                this.onSubmitFormAddress(response.other_store_in_area);
              }).catch((e) => {
              console.error(e);
              this.toastHelper.connectionError();
              this.loadingHelper.setLoading('setSettings', false);
            });
          }
        });
      } else {
        this.alertHelper.show('Fora de corbertura', 'No momento não efetuamos entregas na sua região.');
        try {
          this.trackHelper.trackByName(TrackHelper.EVENTS.NEW_ADDRESS_OUT_OF_AREA);
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }
    try {
      this.trackHelper.trackByName(TrackHelper.EVENTS.NEW_ADDRESS_FINISH);
    } catch (e) {
      console.error(e);
    }
    await this.modalCtrl.dismiss({
      user_address: response.data,
    }).catch(e => console.error(e));
  }

  validationMessages = {}
}
