import { Component, ViewChild } from '@angular/core';
import { NavController, IonInput } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AuthService, loginCredentials } from '../../providers/auth-service';
import { LoadingHelper } from '../../utils/loading-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { AppConfig } from '../../../configs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'page-sign-in',
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {

  loginForm: FormGroup;
  dataForm: { email: string; password: string; };
  formErrors: FormErrors;
  inputType = 'password';

  @ViewChild('input') inputPassword: IonInput;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private alertHelper: AlertHelper,
              private loadingHelper: LoadingHelper,
              public navCtrl: NavController,
              private appConfig: AppConfig,
              private router: Router,
              private route: ActivatedRoute,
            ) {

    
    this.route.queryParams.subscribe(params => {
      const email = params['email'] || this.appConfig.DEBUG_EMAIL || '';

      this.dataForm = {
        email: this.appConfig.DEBUG ? email : '',
        password: this.appConfig.DEBUG ? this.appConfig.DEBUG_PASSWORD : ''
      };

      this.buildForm();
    });
  }

  get appName() {
    return this.appConfig.APP_NAME;
  }

  ionViewDidLoad() {
    if (this.dataForm.email) {
      setTimeout(() => this.inputPassword.setFocus(), 400);
    }
  }

  onSubmit() {
    this.formErrors.setSubmitted();
    if (this.loginForm.valid) {
      this.login({
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value
      });
    }
  }

  toggleShowPassword() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  buildForm(): void {
    this.loginForm = this.fb.group({
      'email': [this.dataForm.email, [
        Validators.required,
        Validators.email
      ]],
      'password': [this.dataForm.password, [
        Validators.required,
        Validators.minLength(this.appConfig.MIN_LENGTH_PASSWORD),
        Validators.maxLength(this.appConfig.MAX_LENGTH_PASSWORD)
      ]]
    });
    this.formErrors = new FormErrors(this.loginForm, this.validationMessages);

  }

  validationMessages = {
    'email': {
      'required': 'Digite o seu e-mail cadastrado.',
      'minlength': 'O e-mail está muito curto.',
      'maxlength': 'O e-mail está muito longo.'
    },
    'password': {
      'required': 'Digite a sua senha.',
      'minlength': 'Campo senha está muito curto.',
      'maxlength': 'Campo senha está muito longo.'
    }
  };

  login(credentials: loginCredentials): Promise<any> {
    this.formErrors.setSubmitted();
    this.loadingHelper.show(null, 20000);
    return this.auth.login(credentials).then(
      () => {        
        this.navCtrl.navigateRoot('/HomePage');
      },
      (err) => {
        this.loadingHelper.hide();
        this.alertHelper.show('Erro', 'Verifique o seu e-mail e senha e tente novamente.');
        console.debug(err);
      }).catch((error) => {
      this.loadingHelper.hide();
      this.alertHelper.show('Erro', 'Não foi possível efetuar o login no momento.');
      console.debug(error);
    });

  }

  logout() {
    this.auth.logout();
  }


  goToForgotPassword() {
    const email = this.loginForm.get('email')?.value || '';
    this.router.navigate(['/ForgotPassword'], { queryParams: { email } });
  }

  goToSignUp() {
    this.router.navigate(['/SignUp']);
  }

}
