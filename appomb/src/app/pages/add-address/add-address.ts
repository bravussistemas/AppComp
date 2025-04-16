import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ModalController, NavController, IonInput } from '@ionic/angular';
import { Router } from '@angular/router';
import { EventService } from '../../providers/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  City,
  GeoServiceProvider,
  IPlaceInfoDO,
  State,
} from '../../providers/geo-service/geo-service';
import { ENV } from '@environment';
import {
  ResultUserAddressCreated,
  UserAddressProvider,
} from '../../providers/user-address/user-address';
import { SearchStatePage } from '../search-state/search-state';
import { SearchCityPage } from '../search-city/search-city';
import {
  SearchAddressMode,
  SearchAddressPage,
} from '../search-address/search-address';
import { AlertHelper } from '../../utils/alert-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { FormErrors } from '../../utils/form-errors';
import { FormHelper } from '../../utils/form-helper';
import { TrackHelper } from '../../providers/track-helper/track-helper';
import { DeliveryState } from '../../providers/delivery-state/delivery-state';
import { Store } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { Location } from '@angular/common';
import Swiper from 'swiper';

enum FindAddressMethod {
  BY_CEP,
  BY_ADDRESS,
}

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.html',
  styleUrls: ['./add-address.scss'],
})
export class AddAddressPage {
  @ViewChild('numberInput') numberInput: IonInput;
  @ViewChild('cepInput') cepInput: IonInput;
  @ViewChild('slider', { static: false }) slider: Swiper;
  // @ViewChild('addressInput') addressInput: TextInput;

  findMethods = FindAddressMethod;
  findMethod: FindAddressMethod;

  formCep: FormGroup;
  formCepErrors: FormErrors;

  formAddress: FormGroup;
  formAddressErrors: FormErrors;

  selectedState: State;
  selectedCity: City;

  hasComplement = true;

  formData: any = {};

  cleanIfAddressChanges = false;
  enableCep = false;

  constructor(
    public navCtrl: NavController,
    //public events: Events,
    private location: Location,
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
    private router: Router,
    public fb: FormBuilder
  ) {
    if (ENV.DEBUG) {
      this.formData.cep = '89220140';
    }
    this.buildCepForm();
    this.buildAddressForm();
  }

  isFindMethod(findMethod: FindAddressMethod) {
    return this.findMethod === findMethod;
  }

  ionViewDidLoad() {
    this.init(this.deliveryState.store);
  }

  init(store: Store) {
    if (store.register_address_by_cep) {
      this.enableCep = true;
    }
    try {
      this.trackHelper.trackByName(TrackHelper.EVENTS.NEW_ADDRESS_START);
    } catch (e) {
      console.error(e);
    }

    this.location.back = () => {
      if (!store.register_address_by_cep) {
        this.navCtrl.pop();
      } else {
        if (this.slider.isBeginning) {
          this.navCtrl.pop();
        } else {
          this.resetAddressForm();
          this.prevSlide();
        }
      }
    };

    // Disable keyboard controls and lock swipes
    this.slider.keyboard.enabled = false;
    this.slider.allowTouchMove = false;

    setTimeout(() => {
      if (this.cepInput) {
        this.cepInput.setFocus();
      }
    }, 500);
  }

  nextSlide() {
    this.slider.allowTouchMove = false;
    this.slider.slideNext();
    this.slider.allowTouchMove = true;
  }

  prevSlide() {
    this.slider.allowTouchMove = false;
    this.slider.slidePrev();
    this.slider.allowTouchMove = true;
  }

  resetAddressForm() {
    this.formAddress.reset();
    this.buildAddressForm();
    this.formAddressErrors.setUnsubmitted();
  }

  buildCepForm() {
    this.formCep = this.fb.group({
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    });
    this.formCep.patchValue(this.formData);
    this.formCepErrors = new FormErrors(this.formCep, this.validationMessages);
  }

  onSubmitFormCep() {
    this.formCepErrors.setSubmitted();
    if (!this.formCep.valid) {
      return;
    }
    this.loadingHelper.show();
    this.loadingHelper.setLoading('cepData', true);
    this.geoService
      .searchCep(this.formCep.get('cep').value)
      .subscribe((resp) => {
        console.debug('searchCep');
        console.debug(resp);
        this.findMethod = FindAddressMethod.BY_CEP;
        this.nextSlide();
        this.loadingHelper.setLoading('cepData', false);
        this.loadingHelper.hide();
        if (resp.state) {
          this.formAddress.get('state').setValue(resp.state);
        }
        if (resp.city) {
          this.formAddress.get('city').setValue(resp.city);
        }
        if (resp.street) {
          this.formAddress.get('street').setValue(resp.street);
        }
        this.formAddress.get('district').setValue(resp.district);
        this.formAddress.get('zipCode').setValue(resp.cep);
        this.ref.detectChanges();
        setTimeout(() => {
          this.numberInput.setFocus();
        }, 500);
      });
  }

  get stateFieldEnabled() {
    return !(
      this.isFindMethod(FindAddressMethod.BY_CEP) &&
      this.formAddress.controls['state'].value
    );
  }

  get cityFieldEnabled() {
    return !(
      (this.isFindMethod(FindAddressMethod.BY_ADDRESS) &&
        !this.formAddress.controls['state'].value) ||
      (this.isFindMethod(FindAddressMethod.BY_CEP) &&
        this.formAddress.controls['city'].value)
    );
  }

  get streetFieldEnabled() {
    return !(
      this.isFindMethod(FindAddressMethod.BY_CEP) &&
      this.formAddress.controls['street'].value
    );
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
      componentProps: { stateId: this.selectedState?.id }, // Pass the stateId as a prop
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.formAddress.get('city')?.setValue(data.name);
      this.selectedCity = data;
    }
  }

  async goToChooseAddress() {
    const searchText = `${this.formAddress.get('street')?.value}, ${
      this.formAddress.get('number')?.value
    } - ${this.selectedState?.abbr}`;

    const modal = await this.modalCtrl.create({
      component: SearchAddressPage,
      componentProps: {
        mode: SearchAddressMode.PICK_ONE,
        city: this.selectedCity?.name,
        searchText: searchText,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss<IPlaceInfoDO>();
    if (data) {
      this.loadingHelper.show();
      this.formAddress.get('district')?.setValue(data.neighborhood);

      if (data.street) {
        this.formAddress.get('street')?.setValue(data.street);
      }

      if (!data.neighborhood) {
        this.toastHelper.show({
          message: 'Não foi possível identificar o seu endereço.',
        });
        this.loadingHelper.hide();
        return;
      }

      this.cleanIfAddressChanges = true;
      this.onSubmitFormAddress();
    }
  }

  buildAddressForm() {
    const COMPLEMENT_VALIDATORS = [Validators.required];
    this.formAddress = this.fb.group({
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      street: [null, [Validators.required]],
      district: [null, []],
      zipCode: [null, []],

      number: [null, [Validators.required]],
      complement: [null, COMPLEMENT_VALIDATORS],
      ref: [null, []],
      withoutComplement: [false, []],
    });
    const formUtils = new FormHelper(this.formAddress);

    this.formAddress.valueChanges.subscribe((data) => {
      console.log('valueChanges');
      console.log(data);
      if (
        this.cleanIfAddressChanges &&
        this.formAddress.get('district').value
      ) {
        console.log('cleanIfAddressChanges');
        this.formAddress.get('district').setValue(null);
        this.cleanIfAddressChanges = false;
      }
    });
    this.formAddress.get('withoutComplement').valueChanges.subscribe((val) => {
      this.hasComplement = !val;
      if (!this.hasComplement) {
        formUtils.setValidators('complement', null);
      } else {
        formUtils.setValidators('complement', COMPLEMENT_VALIDATORS);
      }
    });

    this.formAddressErrors = new FormErrors(
      this.formAddress,
      this.validationMessages
    );
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
    if (!this.formAddress.get('district').value) {
      console.debug('Without district, we need list address to choose');
      this.goToChooseAddress();
      return;
    }
    this.loadingHelper.show();
    const data = this.formAddress.getRawValue();
    const stateId = this.selectedState ? this.selectedState.id : null;
    const cityId = this.selectedCity ? this.selectedCity.id : null;
    this.userAddressProvider
      .create({
        state: stateId,
        city: cityId,
        state_abbr: data.state,
        city_name: data.city,
        street: data.street,
        district: data.district,
        zip_code: data.zipCode,
        number: data.number,
        complement: data.complement,
        ref: data.ref,
        without_complement: data.withoutComplement,
        store: store.id,
      })
      .subscribe((resp: ResultUserAddressCreated) => {
        this.loadingHelper.hide();
        this.handleSuccessResponse(resp);
      });
  }

  async handleSuccessResponse(response: ResultUserAddressCreated) {
    if (!response || !response.has_point) {
      this.alertHelper.show(
        'Não conseguimos localizar o seu endereço. Verifique as informações e tente novamente.'
      );
      try {
        this.trackHelper.trackByName(
          TrackHelper.EVENTS.NEW_ADDRESS_NOT_FOUND,
          response
        );
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (!response.in_delivery_area) {
      if (response.other_store_in_area) {
        const storeName = response.other_store_in_area.name;
        const isConfirmed = await this.alertHelper.confirm(
          'Endereço atendido por outra loja',
          `Notamos que esse endereço é atendido por outra loja (<b>${storeName}</b>). Deseja alterar a loja para continuar?`
        );

        if (isConfirmed) {
          try {
            await this.settingsService.chooseStore(
              response.other_store_in_area
            );
            this.onSubmitFormAddress(response.other_store_in_area);
          } catch (e) {
            console.error(e);
            this.toastHelper.connectionError();
            this.loadingHelper.setLoading('setSettings', false);
          }
        }
      } else {
        this.alertHelper.show(
          'Fora de cobertura',
          'No momento não efetuamos entregas na sua região.'
        );
        try {
          this.trackHelper.trackByName(
            TrackHelper.EVENTS.NEW_ADDRESS_OUT_OF_AREA
          );
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

    this.modalCtrl
      .dismiss({
        user_address: response.data,
      })
      .catch((e) => console.error(e));
  }

  findAddressByAddressClicked() {
    try {
      this.trackHelper.trackByName(TrackHelper.EVENTS.NOT_KNOWN_MY_CEP_CLICK);
    } catch (e) {
      console.error(e);
    }
    this.findMethod = FindAddressMethod.BY_ADDRESS;
    this.nextSlide();
  }

  validationMessages = {
    cep: {
      required: 'Digite o CEP.',
    },
  };
}
