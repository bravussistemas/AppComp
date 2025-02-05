import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AuthService } from '../../providers/auth-service';
import { AppConfig } from '../../../configs';
import { LoadingHelper } from '../../utils/loading-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordPage implements OnInit {
  @ViewChild('inputCode') inputCode: IonInput;
  @ViewChild('inputPassword') inputPassword: IonInput;

  form: FormGroup;
  formCode: FormGroup;
  formPassword: FormGroup;

  formErrors: FormErrors;
  formCodeErrors: FormErrors;
  formPasswordErrors: FormErrors;

  dataForm: { email: string };

  STEPS = {
    SEND_EMAIL: 'SEND_EMAIL',
    VALIDATE_CODE: 'VALIDATE_CODE',
    CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  };

  CURRENT_STEP = this.STEPS.SEND_EMAIL;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private loadingHelper: LoadingHelper,
    private alertHelper: AlertHelper,
    private trans: TranslateService,
    private appConfig: AppConfig
  ) {
    this.dataForm = { email: '' };
  }

  ngOnInit() {
    this.buildForm();
    this.buildFormCode();
    this.buildFormPassword();
  }

  onSubmit() {
    this.formErrors.setSubmitted();
    if (!this.form.valid) return;

    this.loadingHelper.show();
    this.auth.sendResetPasswordCode(this.form.controls['email'].value).subscribe(
      () => {
        this.loadingHelper.hide();
        this.setStep(this.STEPS.VALIDATE_CODE);
        setTimeout(() => this.inputCode?.setFocus(), 400);
      },
      (error) => {
        console.error(error);
        this.loadingHelper.hide();
      }
    );
  }

  onSubmitCode() {
    this.formCodeErrors.setSubmitted();
    if (!this.formCode.valid) return;

    this.loadingHelper.show();
    this.auth
      .confirmResetPasswordCode({
        code: this.formCode.controls['code'].value,
        email: this.form.controls['email'].value,
      })
      .subscribe(
        () => {
          this.loadingHelper.hide();
          this.setStep(this.STEPS.CHANGE_PASSWORD);
          setTimeout(() => this.inputPassword?.setFocus(), 400);
        },
        (error) => {
          console.error(error);
          this.loadingHelper.hide();
        }
      );
  }

  onSubmitPassword() {
    this.formPasswordErrors.setSubmitted();
    if (!this.formPassword.valid) return;

    const data = {
      new_password: this.formPassword.controls['new_password'].value,
      confirm_new_password: this.formPassword.controls['confirm_new_password'].value,
      code: this.formCode.controls['code'].value,
      email: this.form.controls['email'].value,
    };

    this.loadingHelper.show();
    this.auth.setNewPasswordReset(data).subscribe(
      () => {
        this.loadingHelper.hide();
        this.trans.get('SUCCESS_RESET_PASSWORD').subscribe((res) => {
          this.alertHelper.show(res);
          this.auth.login({ email: data.email, password: data.new_password });
        });
      },
      (error) => {
        console.error(error);
        this.loadingHelper.hide();
      }
    );
  }

  buildForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.formErrors = new FormErrors(this.form, this.validationMessages);
  }

  buildFormCode(): void {
    this.formCode = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
    this.formCodeErrors = new FormErrors(this.formCode, this.validationMessages);
  }

  buildFormPassword(): void {
    this.formPassword = this.fb.group(
      {
        new_password: [
          '',
          [
            Validators.required,
            Validators.minLength(this.appConfig.MIN_LENGTH_PASSWORD),
            Validators.maxLength(this.appConfig.MAX_LENGTH_PASSWORD),
          ],
        ],
        confirm_new_password: [
          '',
          [Validators.required],
        ],
      },
      { validators: this.passwordMatchValidator }
    );
    this.formPasswordErrors = new FormErrors(this.formPassword, this.validationMessages);
  }

  setStep(step: string) {
    this.CURRENT_STEP = step;
  }

  passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('new_password')?.value;
    const confirmPassword = control.get('confirm_new_password')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      control.get('confirm_new_password')?.setErrors({ validateEqual: true });
    } else {
      control.get('confirm_new_password')?.setErrors(null);
    }
  }

  validationMessages = {
    email: {
      required: 'Digite o seu e-mail cadastrado.',
      email: 'Digite um e-mail válido.',
    },
    code: {
      required: 'Digite o código enviado por e-mail.',
      minlength: 'O código deve conter 6 dígitos.',
      maxlength: 'O código deve conter 6 dígitos.',
    },
    new_password: {
      required: 'Digite a sua senha.',
      minlength: `A senha deve ter no mínimo ${this.appConfig.MIN_LENGTH_PASSWORD} caracteres.`,
      maxlength: `A senha deve ter no máximo ${this.appConfig.MAX_LENGTH_PASSWORD} caracteres.`,
    },
    confirm_new_password: {
      required: 'Digite a confirmação da senha.',
      validateEqual: 'A senha de confirmação não confere.',
    },
  };
}
