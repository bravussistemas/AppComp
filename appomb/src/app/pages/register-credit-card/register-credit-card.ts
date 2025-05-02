import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  LoadingController,
  ModalController,
  NavController,
  IonInput,
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AppConfig } from '../../../configs';
import { AlertHelper } from '../../utils/alert-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../providers/auth-service';
import { validateCPF, validateFullName } from '../../utils/validators';
import { CreditCardService } from '../../providers/credit-card.service';
import { ToastHelper } from '../../utils/toast-helper';
import * as CPF from 'gerador-validador-cpf';
import { ResponseError } from '../../utils/response-helper';
import { HttpClient } from '@angular/common/http';
import { Utils } from '../../utils/utils';
import { CreditCardValidator } from '../../libs/angular-cc-library/src/credit-card.validator';
import { BrandUtils } from '../../utils/brands-utils';
import { TrackHelper } from '../../providers/track-helper/track-helper';
import { EventService } from 'src/app/providers/event.service';
import { Swiper } from 'swiper';
import { CardErrorPopUp } from '../card-error-pop-up/card-error-pop-up';
import { ActivatedRoute, Router } from '@angular/router';
import { register } from 'swiper/element/bundle';

const brandsMapped = BrandUtils.getBrands().map((item) => {
  return {
    value: item.id,
    label: item.name,
    icon: item.icon,
  };
});

@Component({
  selector: 'page-register-credit-card',
  templateUrl: './register-credit-card.html',
  styleUrl: './register-credit-card.scss',
})
export class RegisterCreditCard implements AfterViewInit, OnInit {
  formSteps = {
    STEP_CARD_INFO: 'STEP_CARD_INFO',
    STEP_HOLDER_INFO: 'STEP_HOLDER_INFO',
  };

  slides: any;
  brands = BrandUtils;
  formStep = this.formSteps.STEP_CARD_INFO;
  allowNext: any;
  allowPrev: any;

  form: FormGroup;

  @ViewChild('mySlider', { static: false }) sliderEl!: ElementRef;

  @ViewChild('inputCvv') inputCvv: IonInput;
  @ViewChild('inputExpiration') inputExpiration: IonInput;
  @ViewChild('inputCardHolderId') inputCardHolderId: IonInput;

  dataForm: {
    cardHolderName: string;
    cardHolderId: string;
    cardNumber: string;
    cardBrandId: number;
    expiration: string;
    cvv: string;
  };
  isFirstAccess = false;
  redirectAfter;
  formErrors: FormErrors;

  cardBrands = brandsMapped;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private alertHelper: AlertHelper,
    private loadingCtrl: LoadingController,
    private loadingHelper: LoadingHelper,
    private trans: TranslateService,
    private authService: AuthService,
    private toastHelper: ToastHelper,
    private modalCtrl: ModalController,
    private creditCardService: CreditCardService,
    private events: EventService,
    private trackHelper: TrackHelper,
    private appConfig: AppConfig
  ) {
    this.isFirstAccess =
      route.snapshot.paramMap.get('isFirstAccess') === 'true';
    this.redirectAfter = route.snapshot.paramMap.get('redirectAfter');
    this.slides = [
      {
        id: this.formSteps.STEP_CARD_INFO,
      },
      {
        id: this.formSteps.STEP_HOLDER_INFO,
      },
    ];
    if (appConfig.DEBUG) {
      this.dataForm = {
        cardHolderName: 'John Snow',
        cardHolderId: CPF.generate(),
        cardNumber: '5448280000000007',
        cardBrandId: 3,
        expiration: '01/28',
        cvv: '123',
      };
    } else {
      this.dataForm = {
        cardHolderName: '',
        cardHolderId: '',
        cardNumber: '',
        cardBrandId: null,
        expiration: '',
        cvv: '',
      };
    }

    this.buildForm();
  }

  ngOnInit() {
    register();
  }

  ngAfterViewInit() {
    // Desabilitar controle de teclado
    // this.slider.keyboard.disable();

    this.allowNext = this.sliderEl.nativeElement.swiper.allowSlideNext;
    this.allowPrev = this.sliderEl.nativeElement.swiper.allowSlidePrev;
    this.allowNext = false;
    this.allowPrev = false;
  }

  ionViewWillEnter() {
    if (!this.isFirstAccess) {
      // Personalize o comportamento de navegação (caso necessário)
      // Por exemplo: Adicionar comportamento personalizado ao botão Voltar
      history.pushState(null, '', document.URL); // Garante estado de navegação
    }
  }

  setStep(step: string) {
    this.formStep = step;
  }

  buildForm(): void {
    this.form = this.fb.group({
      cardHolderName: [
        this.dataForm.cardHolderName,
        [
          Validators.required,
          Validators.minLength(this.appConfig.MIN_LENGTH_NAME),
          Validators.maxLength(this.appConfig.MAX_LENGTH_NAME),
          validateFullName,
        ],
      ],
      cardHolderId: [
        this.dataForm.cardHolderId,
        [Validators.required, validateCPF],
      ],
      cardNumber: [
        this.dataForm.cardNumber,
        [Validators.required, <any>CreditCardValidator.validateCCNumber],
      ],
      cardBrandId: [this.dataForm.cardBrandId, [Validators.required]],
      expiration: [
        this.dataForm.expiration,
        [Validators.required, <any>CreditCardValidator.validateExpDate],
      ],
      cvv: [
        this.dataForm.cvv,
        [
          Validators.required,
          <any>Validators.required,
          <any>Validators.minLength(3),
          <any>Validators.maxLength(4),
        ],
      ],
    });
    this.formErrors = new FormErrors(this.form, this.validationMessages);

    this.form.controls['expiration'].valueChanges.subscribe(() => {
      if (
        this.form.controls['expiration'].dirty &&
        this.form.controls['expiration'].valid
      ) {
        this.inputCvv.setFocus();
      }
    });

    this.form.controls['cardNumber'].valueChanges.subscribe((newValue) => {
      const brandId = BrandUtils.getBrandId(newValue);
      if (brandId) {
        this.form.controls['cardBrandId'].setValue(brandId);
      } else {
        this.form.controls['cardBrandId'].setValue(null);
      }
    });
  }

  get currentBrandId() {
    return this.form.value.cardBrandId;
  }

  validationMessages = {
    cardNumber: {
      minlength: `O nome deve ter no mínimo ${this.appConfig.MIN_LENGTH_NAME} caracteres.`,
      maxlength: `O nome deve ter no máximo ${this.appConfig.MAX_LENGTH_PASSWORD} caracteres.`,
    },
    cardBrandId: {},
    cardHolderName: {},
    cardHolderId: {},
    expiration: {},
    cvv: {},
  };

  formCardInfoIsValid() {
    return (
      this.form.controls['cardNumber'].valid &&
      this.form.controls['cardBrandId'].valid &&
      this.form.controls['expiration'].valid &&
      this.form.controls['cvv'].valid
    );
  }

  formIsValid() {
    return this.form.valid;
  }

  submitForm() {
    this.formErrors.setSubmitted();
    if (this.formIsValid()) {
      this.loadingHelper.show();
      // Paggcard rules: split request data in two request.
      // 1 - create card with principal data (first request)
      this.creditCardService
        .create({
          card_number: this.form.value.cardNumber,
          brand: this.form.value.cardBrandId,
          card_holder_name: this.form.value.cardHolderName,
          card_holder_id: Utils.cleanNonDigits(this.form.value.cardHolderId),
        })
        .subscribe(
          (res: any) => {
            let cardId = res.id;
            // 2 - update card with another information.
            this.creditCardService
              .finishCreate({
                card: cardId,
                cvv: this.form.value.cvv,
                valid_date: this.form.value.expiration,
              })
              .subscribe(
                (res: any) => {
                  // 3 - validate card.
                  this.creditCardService.validate(cardId).subscribe(
                    (res: any) => {
                      if (res.is_valid) {
                        this.onValidCard({ id: cardId });
                      } else {
                        this.onInvalidCard();
                      }
                    },
                    (e) => {
                      this.handlerRegisterCard(e);
                    }
                  );
                },
                (e) => {
                  this.handlerRegisterCard(e);
                }
              );
          },
          (e) => {
            this.handlerRegisterCard(e);
          }
        );
    } else {
      this.trans.get('CHECK_FORM_ERRORS').subscribe((res: any) => {
        this.alertHelper.show(res);
      });
    }
  }

  setupBackButton(handler: () => void): void {
    // Define o evento de retorno do botão "Voltar" do navegador
    window.onpopstate = handler;
  }

  goToFormStep(formStep: string) {
    console.debug('Segment changed to: ', formStep);

    // Validação da etapa atual antes de prosseguir
    if (this.formStep === this.formSteps.STEP_CARD_INFO) {
      this.formErrors.setSubmitted();
      if (!this.formCardInfoIsValid()) {
        return; // Bloqueia a navegação se os dados forem inválidos
      }
      this.formErrors.setUnsubmitted(); // Restaura o estado dos erros
    }

    // Configurar o comportamento do botão Voltar
    if (formStep === this.formSteps.STEP_HOLDER_INFO) {
      this.setupBackButton(() =>
        this.goToFormStep(this.formSteps.STEP_CARD_INFO)
      );
    } else {
      this.setupBackButton(() => window.history.back());
    }

    const selectedIndex = this.slides.findIndex(
      (slide: any) => slide.id === formStep
    );

    if (selectedIndex !== -1) {
      this.formStep = formStep;
      this.allowNext = true;
      this.allowPrev = true;

      // Navegação sem `then`, pois o retorno é booleano
      // const slideChanged = this.slider.slideTo(selectedIndex);
      const slideChanged =
        this.sliderEl.nativeElement.swiper.slideTo(selectedIndex);
      console.log(slideChanged);
      console.log(this.sliderEl.nativeElement.swiper);

      if (slideChanged) {
        // Resetar o estado após a navegação bem-sucedida
        this.allowNext = false;
        this.allowPrev = false;
      } else {
        console.error('Erro ao tentar navegar para o slide.');
      }
    } else {
      console.error(`Slide não encontrado para a etapa: ${formStep}`);
    }
  }

  changeValueHolder(event: any) {
    let value = event.target.value;

    value = value.replace(/\D/g, '');

    value = value.slice(0, 11);

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    }

    this.inputCardHolderId.value = value;
    console.log(this.inputCardHolderId.value);
  }

  changeValueExpiration(event: any) {
    let value = event.target.value;

    value = value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 4);
      value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
    }

    this.inputExpiration.value = value;
    console.log(this.inputExpiration.value);
  }

  skipCardRegister() {
    this.trans
      .get([
        'QUESTION_SKIP_REGISTER_CARD',
        'EXPLANATION_SKIP_REGISTER_CARD',
        'BTN_SKIP',
        'BTN_REGISTER',
      ])
      .subscribe((res: any) => {
        this.alertHelper
          .confirm(
            res.QUESTION_SKIP_REGISTER_CARD,
            res.EXPLANATION_SKIP_REGISTER_CARD,
            res.BTN_SKIP,
            res.BTN_REGISTER
          )
          .then((confirmed) => {
            console.log(confirmed);
            if (confirmed) {
              this.finish();
            }
          });
      });
  }

  finish() {
    if (this.isFirstAccess) {
      this.authService.getUser().then((user) => {
        this.loadingHelper.hide();
        this.events.emitEvent('userLogIn', user);
      });
    } else {
      this.loadingHelper.hide();
      if (this.redirectAfter === 'pop') {
        window.history.back(); // Voltar para a página anterior
      } else {
        const navigationPath = this.redirectAfter || '/HomeList';
        this.router.navigate([navigationPath]).then(() => {
          if (this.redirectAfter) {
            this.router.navigate([this.redirectAfter]);
          }
        });
      }
    }
  }

  onInvalidCard() {
    this.loadingHelper.hide();
    this.alertHelper.show(
      'Erro',
      'O cartão foi recusado pelo emissor ou possui dados inválidos.'
    );
  }

  onValidCard(data) {
    if (!this.redirectAfter) {
      this.toastHelper.show({
        message: 'Cartão adicionado com sucesso!',
        cssClass: 'toast-success',
        duration: 2000,
      });
    }
    this.events.emitEvent('creditCardAdded', data);
    this.finish();
  }

  handlerRegisterCard(error: Response | any) {
    this.loadingHelper.hide();

    // VALIDATION ERRORS

    if (error instanceof Response) {
      let serverResponse = new ResponseError(error);
      if (serverResponse.status === 400) {
        const errorMsg =
          serverResponse.getErrorMessage() ||
          'Não foi possível validar seu cartão na adquirente. Verifique os dados.';
        this.alertHelper.show(errorMsg);
      } else {
        // UNEXPECTED ERRORS
        if (this.isFirstAccess) {
          this.alertHelper
            .confirm(
              'Erro',
              'Ocorreu um erro ao cadastrar o seu cartão, deseja tentar novamente mais tarde?'
            )
            .then((confirmed) => {
              if (confirmed) {
                this.finish();
              }
            });
        } else {
          this.modalCtrl
            .create({
              component: CardErrorPopUp, // O componente que será exibido no modal
              cssClass: 'card-error-popup', // Opcional: classe CSS personalizada para o modal
            })
            .then((modal) => {
              modal.present();
            })
            .catch((e) => {
              console.error(e);
              this.alertHelper.show(
                'Cartão recusado',
                'Não foi possível validar seu cartão na adquirente. Verifique os dados.'
              );
            });
        }
      }
      if (error) {
        console.error(error);
        throw error;
      }
    }
  }
}
