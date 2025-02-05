import { Component, ViewChild } from '@angular/core';
import { NavController, IonInput } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../utils/form-errors';
import { AlertHelper } from '../../utils/alert-helper';
import { LoadingHelper } from '../../utils/loading-helper';
import { AuthService } from '../../providers/auth-service';
import { Utils } from '../../utils/utils';
import { UserProfileService } from '../../providers/user-profile.service';
import { AppConfig } from '../../../configs';
import { SettingsService } from '../../providers/settings-service';
import { ToastHelper } from '../../utils/toast-helper';
import { EventService } from 'src/app/providers/event.service';

@Component({
  selector: 'page-register-document-note',
  templateUrl: './register-document-note.html',
  styleUrls: ['./register-document-note.scss'],
})
export class RegisterDocumentNote {

  form: FormGroup;

  @ViewChild('input', { static: false }) input: IonInput;

  dataForm: {
    document: string;
  };

  enableBackButton = false;

  formErrors: FormErrors;

  constructor(
    private fb: FormBuilder,
    private toastHelper: ToastHelper,
    private userProfileService: UserProfileService,
    private settingsService: SettingsService,
    private navCtrl: NavController,
    private alertHelper: AlertHelper,
    private appConfig: AppConfig,
    private events: EventService,
    private loadingHelper: LoadingHelper,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Inicializa os dados do formulário com o parâmetro da rota (se existir)
    this.dataForm = {
      document: route.snapshot.paramMap.get('document') || '',
    };

    // Habilita o botão "Voltar" apenas se o documento foi passado pela rota
    this.enableBackButton = !!route.snapshot.paramMap.get('document');

    // Constrói o formulário
    this.buildForm();
  }

  ngOnInit() {
    // Foco no input após o carregamento
    setTimeout(() => {
      this.input?.setFocus();
    }, 500);
  }

  buildForm(): void {
    this.form = this.fb.group({
      document: [
        this.dataForm.document,
        [Validators.required, Validators.pattern(/^\d{11}|\d{14}$/)], // Aceita CPF ou CNPJ sem formatação
      ],
    });

    this.formErrors = new FormErrors(this.form, this.validationMessages);
  }

  validationMessages = {
    document: {
      required: 'O documento é obrigatório.',
      pattern: 'O documento deve ser válido (CPF ou CNPJ).',
    },
  };

  submitForm() {
    this.formErrors.setSubmitted();

    if (this.form.valid) {
      const documentNote = Utils.cleanNonDigits(this.form.value.document);

      // Valida o documento (CPF ou CNPJ)
      if (!Utils.validateDocument(documentNote)) {
        this.alertHelper.show('Documento inválido', 'Por favor, verifique o documento informado e tente novamente.');
        return;
      }

      const data = { document_note: documentNote };

      this.loadingHelper.show();

      this.settingsService.updateSettings(data)
        .then(() => {
          this.loadingHelper.hide();
          this.events.emitEvent('documentNoteUpdated', documentNote);

          // Navega para a página anterior ou uma rota padrão
          if (this.enableBackButton) {
            this.router.navigate(['../'], { relativeTo: this.route });
          } else {
            this.router.navigate(['/HomePage']);
          }
        })
        .catch(() => {
          this.loadingHelper.hide();
          this.toastHelper.connectionError();
        });
    }
  }
}
