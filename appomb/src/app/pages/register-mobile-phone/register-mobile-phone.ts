import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AlertHelper } from '../../utils/alert-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { AuthService } from '../../providers/auth-service';
import { Utils } from '../../utils/utils';
import { UserProfileService } from '../../providers/user-profile.service';
import { AppConfig } from '../../../configs';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-register-mobile-phone',
  templateUrl: './register-mobile-phone.html',
  styleUrls: ['./register-mobile-phone.scss'],
})
export class RegisterMobilePhone implements AfterViewInit {
  form: FormGroup;

  @ViewChild('inputPhone', { static: false }) inputPhone: IonInput;

  dataForm: {
    mobilePhone: string;
  };

  enableBackButton = false;

  formErrors: FormErrors;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inputPhone
        ?.getInputElement()
        .then((nativeInput: HTMLInputElement) => {
          nativeInput.focus();
        });
    });
  }

  constructor(
    public fb: FormBuilder,
    private userProfileService: UserProfileService,
    private alertHelper: AlertHelper,
    private appConfig: AppConfig,
    private loadingHelper: LoadingHelper,
    private authService: AuthService
  ) {
    this.dataForm = {
      mobilePhone: '',
    };
    this.enableBackButton = false;
    this.buildForm();
  }

  get appName() {
    return this.appConfig.APP_NAME;
  }

  ionViewDidLoad() {
    this.setupMask();
  }

  setupMask() {
    this.inputPhone?.getInputElement().then((nativeInput: HTMLInputElement) => {
      nativeInput.focus();
      nativeInput.addEventListener('input', () => {
        const val = nativeInput.value;
        const mask =
          Utils.cleanNonDigits(val).length === 11
            ? '(00) 00000-0000'
            : '(00) 0000-00009';
        nativeInput.value = Utils.applyMask(val, mask);
      });
    });
  }

  ionViewWillEnter() {
    // Configure botão de navegação, se necessário
  }

  buildForm(): void {
    this.form = this.fb.group({
      mobilePhone: [this.dataForm.mobilePhone, [Validators.required]],
    });
    this.formErrors = new FormErrors(this.form, this.validationMessages);
  }

  validationMessages = {
    mobilePhone: {},
  };

  submitForm() {
    this.formErrors.setSubmitted();
    if (this.form.valid) {
      if (!Utils.validatePhoneNumber(this.form.value.mobilePhone)) {
        this.alertHelper.show(
          'Telefone inválido',
          'Por favor, verifique o telefone informado e tente novamente.'
        );
        return;
      }
      const phoneParts = Utils.splitValue(
        Utils.cleanNonDigits(this.form.value.mobilePhone),
        2
      );
      const area = phoneParts[0];
      const number = phoneParts[1];
      const data: any = {
        mobile_phone: number,
        mobile_phone_area: area,
      };
      this.loadingHelper.show();
      this.userProfileService.edit(data).subscribe(
        () => {
          this.loadingHelper.hide();
          this.authService.getUser().then((user) => {
            // Let the method onAuthUser decide what is the next step.
            this.authService.onAuthUser(user);
          });
        },
        () => {
          this.loadingHelper.hide();
        }
      );
    }
  }
}
