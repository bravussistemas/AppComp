import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { Store } from '../../shared/models/store.model';
import { SettingsService } from '../../providers/settings-service';
import { IUserSettings } from '../../shared/interfaces';
import { FormErrors } from '../../utils/form-errors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@capacitor-community/date-picker';
import { HttpUtils } from '../../utils/http-utils';
import * as moment from 'moment';
import { ICreateNoteData, NoteTypeEnum, OperatingDaysNoteService } from '../../providers/operating-days-note.service';
import { LoadingHelper } from '../../utils/loading-helper';
import { ToastHelper } from '../../utils/toast-helper';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseError } from '../../utils/response-helper';
import { AlertHelper } from '../../utils/alert-helper';
import { OperatingDaysNote } from '../../shared/models/operating-day-note.model';
import { AuthService } from '../../providers/auth-service';
import { OperatingDayNoteUtil } from '../../utils/operating-day-note-util';
import { Utils } from '../../utils/utils';
import { User } from '../../shared/models/user.model';
import { DayNotePopUpPage } from '../day-note-pop-up/day-note-pop-up';
import { ActivatedRoute, Router } from '@angular/router';

const VIEWS = {
  FORM: 'FORM',
  LIST: 'LIST',
};

@Component({
  selector: 'page-add-operating-day-note',
  templateUrl: './add-operating-day-note.html',
  styleUrls: ['./add-operating-day-note.scss'],
})
export class AddOperatingDayNotePage {
  //@ViewChild('datepicker') slider: DatePicker;

  store: Store;
  user: User;
  form: FormGroup;
  formErrors: FormErrors;
  day: Date;
  noteType: NoteTypeEnum;
  noteTypeEnum = NoteTypeEnum;
  loaded = false;
  activeView = VIEWS.LIST;

  periods = [
    {value: 0, label: 'Não se repete'},
    {value: 4, label: 'Diário'},
    {value: 3, label: 'Semanal'},
    {value: 1, label: 'Mensalmente'},
    {value: 2, label: 'Anualmente'},
  ];
  popupTypes = [
    {value: 0, label: 'Normal'},
    {value: 1, label: 'Atualização do app'},
  ];

  selectedRepeatPeriod: number;
  selectedPopupType: number;

  currentNoteList: OperatingDaysNote[];
  currentNote: OperatingDaysNote;
  notes: OperatingDaysNote[];

  constructor(private settingsService: SettingsService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private operatingDaysNoteService: OperatingDaysNoteService,
              //private datePicker: DatePicker,
              private navParams: NavParams,
              private authService: AuthService,
              private trans: TranslateService,
              private loadingHelper: LoadingHelper,
              private alertError: AlertHelper,
              private alertHelper: AlertHelper,
              private modalCtrl: ModalController,
              private toastHelper: ToastHelper,
              public navCtrl: NavController) {
  }

  async init(noteType?) {
    this.activeView = VIEWS.LIST;
    this.loadingHelper.show();
    this.notes = null;
    this.currentNote = null;
    this.loaded = false;
    this.selectedRepeatPeriod = this.periods[0].value;
    this.selectedPopupType = this.popupTypes[0].value;
  
    // Obtenha parâmetros da rota (substituindo NavParams)
    const routeParams = this.route.snapshot.queryParams;
    this.day = (routeParams['day'] || moment()).toDate();
    this.noteType = noteType || routeParams['noteType'] || NoteTypeEnum.NORMAL;
  
    this.buildForm(this.noteType);
  
    try {
      // Obtenha o usuário autenticado
      this.user = await this.authService.getUser();
      const result: IUserSettings = await this.settingsService.getSettings();
  
      this.store = result.store;
  
      // Verifique permissões do usuário
      if (!Utils.isAdminOrStoreSeller(this.user, this.store)) {
        await this.router.navigate(['/home']); // Redireciona para a página inicial
        this.loadingHelper.hide();
        return;
      }
  
      // Carrega notas do dia
      this.loadNoteOfDay();
    } catch (error) {
      this.catchError(error);
    } finally {
      this.loadingHelper.hide();
    }
  }

  ionViewDidLoad() {
    this.init();
  }

  changeToView(view) {
    this.activeView = view;
  }

  loadNoteOfDay() {
    this.loadingHelper.show();
    this.operatingDaysNoteService.getDay(this.store.id, moment(this.day), true, false)
      .subscribe((res) => {
          this.notes = res;
          this.changeNoteType(res, this.noteType);
          this.loaded = true;
          this.loadingHelper.hide();
        },
        this.catchError.bind(this))
  }

  changeNoteType(notes: OperatingDaysNote[], noteType: NoteTypeEnum) {
    let currentNoteList = OperatingDayNoteUtil.getByTypeList(notes, noteType);
    this.currentNoteList = currentNoteList;
    this.currentNote = OperatingDayNoteUtil.getByType(currentNoteList.filter(item => item.is_visible), noteType);
    this.noteType = noteType;
    this.buildForm(noteType);
  }

  onSegmentChanged(event) {
    this.changeNoteType(this.notes, event.value);
  }

  buildForm(noteType: NoteTypeEnum): void {
    if (Utils.isNullOrUndefined(this.form)) {
      this.form = this.fb.group({
        'day': ['', [
          Validators.required,
        ]],
        'repeat_period': ['', [
          Validators.required,
        ]],
        'popup_type': ['', [
          Validators.required,
        ]],
        'app_version_to_update': ['', [
          Validators.required,
        ]],
        'message': ['', [
          Validators.required
        ]],
        'title': ['', [
          Validators.required
        ]],
        'showAllOpen': false,
        'image': [''],
        'note_type': [noteType, [
          Validators.required
        ]]
      });
    }
    this.form.get('app_version_to_update').disable();
    this.form.get('popup_type').valueChanges.subscribe((value) => {
      if (value === 1) {
        this.form.get('app_version_to_update').enable();
      } else {
        this.form.get('app_version_to_update').disable();
      }
    });
    if (noteType === NoteTypeEnum.WARNING) {
      this.form.get('title').enable();
      this.form.get('image').enable();
      this.form.get('showAllOpen').enable();
      this.form.get('popup_type').enable();
    } else {
      this.form.get('title').disable();
      this.form.get('image').disable();
      this.form.get('showAllOpen').disable();
      this.form.get('popup_type').disable();
    }
    this.formErrors = new FormErrors(this.form, {});
  }

  createNote() {
    this.formErrors.setSubmitted();
    if (this.form.valid) {
      this.loadingHelper.show();
      const data: ICreateNoteData = {
        day: HttpUtils.dateToUrl(moment(this.day)),
        repeat_period: this.form.controls['repeat_period'].value,
        message: this.form.controls['message'].value,
        store: this.store.id,
        note_type: this.noteType
      };
      if (this.noteType === NoteTypeEnum.WARNING) {
        data.title = this.form.controls['title'].value || null;
        data.url_image = this.form.controls['image'].value || null;
        data.is_app_update_notice = this.form.controls['popup_type'].value == 1;
        data.app_version_to_update = this.form.controls['app_version_to_update'].value || null;
        data.show_unique = !this.form.controls['showAllOpen'].value;
      }
      this.operatingDaysNoteService.create(data).subscribe(() => {
          this.loadingHelper.hide();
          this.changeToView('LIST');
          this.trans.get('MSG_ADDED').subscribe((val) => this.toastHelper.show({message: val}));
          this.init(this.noteType);
        },
        this.catchError.bind(this)
      )
    }
  }

  setActive(note: OperatingDaysNote) {
    this.loadingHelper.show();
    this.operatingDaysNoteService.setActive(note.id).subscribe(() => {
      this.loadingHelper.hide();
      this.init(this.noteType);
    }, this.catchError.bind(this));
  }

  deleteNote(note: OperatingDaysNote) {
    this.trans.get(['CONFIRM_ACTION', 'CONFIRM_ACTION_REMOVE_MSG'])
      .subscribe((val) => {
        this.alertHelper.confirm(val.CONFIRM_ACTION, val.CONFIRM_ACTION_REMOVE_MSG)
          .then((confirmed) => {
            if (confirmed) {
              this.loadingHelper.show();
              this.operatingDaysNoteService.delete(note.id)
                .subscribe(
                  () => {
                    this.loadingHelper.hide();
                    this.trans.get('MSG_REMOVED').subscribe((val) => {
                      this.toastHelper.show({message: val});
                    });
                    this.init(this.noteType);
                  },
                  (err) => {
                    this.catchError(err);
                  }
                );
            }
          });
      });
  }

  async headerBtnCreateClick() {
    if (this.noteType === NoteTypeEnum.WARNING && this.form.valid) {
      try {
        // Cria o modal
        const modal = await this.modalCtrl.create({
          component: DayNotePopUpPage, // Substitua 'DayNotePopUpPage' pelo componente real
          componentProps: {
            note: <OperatingDaysNote>{
              title: this.form.get('title')?.value,
              message: this.form.get('message')?.value,
              url_image: this.form.get('image')?.value,
            },
            role: 'admin_review'
          }
        });
  
        // Apresenta o modal
        await modal.present();
  
        // Obtém os dados ao fechar o modal
        const { data } = await modal.onDidDismiss();
        if (data === true) {
          this.createNote();
        }
      } catch (error) {
        console.error('Erro ao apresentar o modal:', error);
      }
    } else {
      this.createNote();
    }
  }

  hasNote() {
    if (this.currentNote) {
      return !!this.currentNote.id;
    }
    return false;
  }

  async openDatePicker() {
    try {
      const result = await DatePicker.present({
        mode: 'date', // Tipo de seleção (data)
        date: this.day.toISOString(), // Data inicial
        locale: 'pt-BR', // Localização para formato de data
      });
  
      if (result.value) {
        this.day = new Date(result.value); // Atualiza o dia selecionado
        this.loadNoteOfDay(); // Recarrega as notas do dia selecionado
      }
    } catch (err) {
      console.error('Erro ao abrir o DatePicker:', err);
    }
  }

  catchError(error) {
    this.loadingHelper.hide();
    if (error instanceof Response) {
      let respError = new ResponseError(error);
      this.alertError.show(respError.getErrorMessage());
    } else {
      this.trans.get('ERROR_REQUEST').subscribe((val) => this.toastHelper.show({message: val}));
    }
  }
}
