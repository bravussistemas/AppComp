import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AlertHelper } from '../../utils/alert-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { AuthService } from '../../providers/auth-service';
import { Utils } from '../../utils/utils';
import { UserProfileService } from '../../providers/user-profile.service';
import { AppConfig } from '../../../configs';

@Component({
  selector: 'app-register-mobile-phone',
  templateUrl: './register-mobile-phone.html',
  styleUrls: ['./register-mobile-phone.scss'],
})
export class RegisterMobilePhone {
  form: FormGroup;

  @ViewChild('inputPhone', { static: false }) inputPhone: ElementRef;

  dataForm: {
    mobilePhone: string;
  };

  enableBackButton = false;

  formErrors: FormErrors;

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
    const inputElement = this.inputPhone?.nativeElement as HTMLInputElement;
    if (inputElement) {
      inputElement.addEventListener('input', () => {
        const val = inputElement.value;
        const mask =
          Utils.cleanNonDigits(val).length === 11
            ? '(00) 00000-0000'
            : '(00) 0000-00009';
        inputElement.value = Utils.applyMask(val, mask);
      });
    }
  }

  ionViewWillEnter() {
    // Configure botão de navegação, se necessário
  }

  buildForm(): void {
    this.form = this.fb.group({
      mobilePhone: [
        this.dataForm.mobilePhone,
        [Validators.required],
      ],
    });
    this.formErrors = new FormErrors(this.form, this.validationMessages);
    setTimeout(() => {
      if (this.inputPhone) {
        this.inputPhone.nativeElement.focus();
      }
    });
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
