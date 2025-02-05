import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AppConfig } from '../../../configs';
import { User } from '../../shared/models/user.model';
import { AuthService, EditPasswordData } from '../../providers/auth-service';
import { LoadingHelper } from '../../utils/loading-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.html',
  styleUrl: './edit-password.scss',
})
export class EditPasswordPage implements OnInit {
  @ViewChild('inputPassword') inputPassword: IonInput;

  form: FormGroup;
  formErrors: FormErrors;
  user: User;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private appConfig: AppConfig,
    private loadingHelper: LoadingHelper,
    private alertHelper: AlertHelper,
    private trans: TranslateService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadUser();
  }

  // Carrega informações do usuário
  async loadUser() {
    try {
      this.user = await this.auth.getUser();
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  }

  // Constrói o formulário com validação
  buildForm(): void {
    this.form = this.fb.group(
      {
        old_password: [
          '',
          [
            Validators.required,
            Validators.minLength(this.appConfig.MIN_LENGTH_PASSWORD),
            Validators.maxLength(this.appConfig.MAX_LENGTH_PASSWORD),
          ],
        ],
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
      {
        validators: this.passwordsMatchValidator('new_password', 'confirm_new_password'),
      }
    );

    // Configura o gerenciador de erros
    this.formErrors = new FormErrors(this.form, this.validationMessages);
  }

  // Validador customizado para verificar se as senhas são iguais
  passwordsMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl) => {
      const pass = formGroup.get(password)?.value;
      const confirmPass = formGroup.get(confirmPassword)?.value;
      if (pass && confirmPass && pass !== confirmPass) {
        formGroup.get(confirmPassword)?.setErrors({ validateEqual: true });
      } else {
        formGroup.get(confirmPassword)?.setErrors(null);
      }
    };
  }

  // Mensagens de validação
  validationMessages = {
    old_password: {
      required: 'Digite a sua senha.',
      minlength: `A senha deve ter no mínimo ${this.appConfig.MIN_LENGTH_PASSWORD} caracteres.`,
      maxlength: `A senha deve ter no máximo ${this.appConfig.MAX_LENGTH_PASSWORD} caracteres.`,
    },
    new_password: {
      required: 'Digite uma nova senha.',
      minlength: `A senha deve ter no mínimo ${this.appConfig.MIN_LENGTH_PASSWORD} caracteres.`,
      maxlength: `A senha deve ter no máximo ${this.appConfig.MAX_LENGTH_PASSWORD} caracteres.`,
    },
    confirm_new_password: {
      required: 'Digite a confirmação da nova senha.',
      validateEqual: 'A senha de confirmação não confere.',
    },
  };

  // Submete o formulário
  async onSubmit(valid: boolean) {
    this.formErrors.setSubmitted();
    if (!valid) {
      return;
    }

    this.loadingHelper.show();
    try {
      await this.auth.editPassword(this.form.value);
      this.router.navigateByUrl('/HomePage');
      const successMessage = await this.trans.get('SUCCESS_EDIT_PASSWORD').toPromise();
      this.alertHelper.show(successMessage);
    } catch (error) {
      console.error('Erro ao editar senha:', error);
    } finally {
      this.loadingHelper.hide();
    }
  }
}
