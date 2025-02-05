import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AuthService, signUpCredentials } from '../../providers/auth-service';
import { AppConfig } from '../../../configs';
import { validateFullName } from '../../utils/validators';

@Component({
  selector: 'page-sign-up',
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.html',
})

export class SignUp {

  form: FormGroup;

  dataForm: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  formErrors: FormErrors;

  constructor(public fb: FormBuilder,
              private appConfig: AppConfig,
              public auth: AuthService) {
    this.dataForm = {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    this.buildForm();
  }

  get appName() {
    return this.appConfig.APP_NAME;
  }

  onSubmit() {
    this.passwordEqual();
    this.formErrors.setSubmitted();
    if (this.form.valid) {
      this.signUp({
        name: this.form.controls['name'].value,
        last_name: this.form.controls['lastName'].value,
        email: this.form.controls['email'].value,
        password: this.form.controls['password'].value
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      'name': [this.dataForm.name, [
        Validators.required,
        Validators.minLength(this.appConfig.MIN_LENGTH_NAME),
        Validators.maxLength(this.appConfig.MAX_LENGTH_NAME),
      ]],
      'lastName': [this.dataForm.lastName, [
        Validators.required,
        Validators.minLength(this.appConfig.MIN_LENGTH_NAME),
        Validators.maxLength(this.appConfig.MAX_LENGTH_NAME),
      ]],
      'email': [this.dataForm.email, [
        Validators.required,
        Validators.email
      ]],
      'password': [this.dataForm.password, [
        Validators.required,
        Validators.minLength(this.appConfig.MIN_LENGTH_PASSWORD),
        Validators.maxLength(this.appConfig.MAX_LENGTH_PASSWORD)
      ]],
      'confirmPassword': [this.dataForm.confirmPassword, [
        Validators.required,
        Validators.minLength(this.appConfig.MIN_LENGTH_PASSWORD),
        Validators.maxLength(this.appConfig.MAX_LENGTH_PASSWORD)
      ]]
    });
    this.formErrors = new FormErrors(this.form, this.validationMessages);
    this.form.controls['confirmPassword'].valueChanges.subscribe(() => {
      this.passwordEqual();
    });
    this.form.controls['password'].valueChanges.subscribe(() => {
      this.passwordEqual();
    });
  }

  validationMessages = {
    'name': {
      'required': 'Digite o seu nome.',
      'minlength': `O nome deve ter no mínimo ${this.appConfig.MIN_LENGTH_NAME} caracteres.`,
      'maxlength': `O nome deve ter no máximo ${this.appConfig.MAX_LENGTH_PASSWORD} caracteres.`
    },
    'lastName': {
      'required': 'Digite o seu sobrenome.',
      'minlength': `O sobrenome deve ter no mínimo ${this.appConfig.MIN_LENGTH_NAME} caracteres.`,
      'maxlength': `O sobrenome deve ter no máximo ${this.appConfig.MAX_LENGTH_PASSWORD} caracteres.`
    },
    'email': {
      'required': 'Digite o seu e-mail.',
      'minlength': 'O e-mail está muito curto.',
      'maxlength': 'O e-mail está muito longo.'
    },
    'password': {
      'required': 'Digite a sua senha.',
      'minlength': `A senha deve ter no mínimo ${this.appConfig.MIN_LENGTH_PASSWORD} caracteres.`,
      'maxlength': `A senha deve ter no máximo ${this.appConfig.MAX_LENGTH_PASSWORD} caracteres.`
    },
    'confirmPassword': {
      'required': 'Digite a sua senha.',
      'minlength': `A confirmação da senha deve ter no mínimo ${this.appConfig.MIN_LENGTH_PASSWORD} caracteres.`,
      'maxlength': `A confirmação da senha deve ter no máximo ${this.appConfig.MAX_LENGTH_PASSWORD} caracteres.`,
      'validateEqual': 'A senha de confirmação não confere.'
    }
  };

  passwordEqual() {
    let firstPassword = this.form.controls['password'].value;
    let secondPassword = this.form.controls['confirmPassword'].value;
    if ((firstPassword && secondPassword) && (firstPassword != secondPassword)) {
      this.form.controls['confirmPassword'].setErrors({'validateEqual': true});
      return {'validateEqual': true};
    } else {
      return null;
    }
  }

  signUp(credentials: signUpCredentials) {
    this.auth.signUp(credentials, true);
  }

}
