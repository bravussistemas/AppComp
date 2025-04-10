import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import {EventService} from '../../providers/event.service';
import { IonContent, ModalController, NavController, IonFab } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingHelper } from '../../utils/loading-helper';
import { DateService } from '../../providers/date-service';
import { SettingsService } from '../../providers/settings-service';
import { IUserSettings } from '../../shared/interfaces';
import { Store, StoreTypeEnum } from '../../shared/models/store.model';
import { CartManagerTable } from '../../providers/database/cart-manager-table';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { AuthService } from '../../providers/auth-service';
import * as Raven from 'raven-js';
import { SalesService } from '../../providers/sales.service';
import { DatePicker } from '@capacitor-community/date-picker';
import { AdmListProductsInventoryComponent } from '../../components/adm-list-products-inventory/adm-list-products-inventory';
import { AlertHelper } from '../../utils/alert-helper';
import { NoteTypeEnum } from '../../providers/operating-days-note.service';
import { AdmListProductsResellersInventoryComponent } from '../../components/adm-list-products-resellers-inventory/adm-list-products-resellers-inventory';
import { User } from '../../shared/models/user.model';
import { DeliveryEmployeeFilter, EditDispatchFilterPage } from '../edit-dispatch-filter/edit-dispatch-filter';
import { DispatchOrderAdminList } from '../../shared/models/dispatch-order.model';
import { Utils } from "../../utils/utils";
import { StoreBalance } from "../admin-balance-store/admin-balance-store";
import { AdminStoreService } from "../../providers/admin-store.service";
import { EditInventoryDayItemsPage } from '../edit-inventory-day-items/edit-inventory-day-items';
import {Swiper} from 'swiper';
import { Subscription } from 'rxjs';

declare let $: any;

@Component({
  selector: 'page-adm-manage-product',
  templateUrl: './adm-manage-product.html',
  styleUrls: ['./adm-manage-product.scss'],
})

export class AdmManageProductPage implements OnInit, OnDestroy {
  @ViewChild('mySlider') slider: Swiper;
  @ViewChild('rootContent', { static: false }) rootContent: IonContent;
  @ViewChild('fab') fab: IonFab;
  @ViewChild(AdmListProductsInventoryComponent) listProducts: AdmListProductsInventoryComponent;
  @ViewChild(AdmListProductsResellersInventoryComponent) listResellersProducts: AdmListProductsResellersInventoryComponent;
  private subscriptions: Subscription[] = [];

  SLIDE_BREADS = 'breads';
  SLIDE_RESALE = 'resale';
  SLIDE_DISPATCH = 'dispatch';
  page = 0;

  section: string = this.SLIDE_DISPATCH;
  day: moment.Moment = this.date.today();
  store: Store;
  todayTxt: string;
  storeBalance: StoreBalance;
  error = false;
  dataDispatchOrders;
  private _reorder = false;
  deliveryEmployeesFilter: DeliveryEmployeeFilter[] = [];
  user: User;
  slides = [
    {
      id: this.SLIDE_BREADS,
    },
    {
      id: this.SLIDE_RESALE,
    },
    {
      id: this.SLIDE_DISPATCH,
    }
  ];

  set reorder(value: boolean) {
    this._reorder = value;
    if (this.slider) {
      if (value) {
        this.slider.allowSlideNext = false; // Bloqueia o swipe para frente
        this.slider.allowSlidePrev = false; // Bloqueia o swipe para trás
      } else {
        this.slider.allowSlideNext = true; // Permite o swipe para frente
        this.slider.allowSlidePrev = true; // Permite o swipe para trás
      }
    }
  }
  
  get reorder(): boolean {
    return this._reorder;
  }

  constructor(public router: Router,
              private cartManagerTable: CartManagerTable,
              private renderer: Renderer2,
              public loadingHelper: LoadingHelper,
              private salesService: SalesService,
              private date: DateService,
              private modalCtrl: ModalController,
              private alertHelper: AlertHelper,
              public adminStoreService: AdminStoreService,
              private trans: TranslateService,
              private authService: AuthService,
              public events: EventService,
              private settingsService: SettingsService,) {
    this.trans.get('TODAY').subscribe((val) => this.todayTxt = val);
  }

  get isDeliveryStore() {
    return this.store && this.store.store_type === StoreTypeEnum.DELIVERY;
  }

  ionViewWillEnter() {
    this.setupStyles();
    this.updateSliderProportions();
  }

  eventStoreChanged = (store: Store) => {
    this.init(store);
  };

  eventInventoryEdited = () => {
    this.slider.slideTo(0);
  };

  ngOnInit(): void {
    // Inicialização da tabela do gerenciador de carrinho
    this.cartManagerTable.init().then(() => {
      this.settingsService.getSettings()
        .then((result: IUserSettings) => {
          this.init(result.store);
        });
    });

    // Assinaturas de eventos
    this.subscriptions.push(
      this.events.onEvent('storeChanged').subscribe(data => {
        this.eventStoreChanged(data);
      })
    );

    this.subscriptions.push(
      this.events.onEvent('inventoryEdited').subscribe(data => {
        this.eventInventoryEdited();
      })
    );
  }

  ngOnDestroy(): void {
    // Cancelar todas as assinaturas registradas
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  init(store: Store) {
    this.authService.getUser().then((user) => {
      this.user = user;
      if (!Utils.canAdminStore(user, store)) {
        return this.router.navigateByUrl('HomePage');
      }
      this.setupStyles();
      if (store) {
        this.setStore(store);
      } else {
        this.settingsService.getSettings()
          .then((result: IUserSettings) => {
            this.setStore(result.store);
          });
      }
    });
  }

  setStore(store: Store) {
    this.store = store;
    this.setDay(this.day);
  }

  onSegmentChanged(segmentButton) {
    if (this.reorder) {
      return;
    }
    let selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.value;
    });
    this.slider.slideTo(selectedIndex);
  }

  onSlideChanged(slider) {
    const currentSlide = this.slides[slider.getActiveIndex()];
    if (currentSlide) {
      this.section = currentSlide.id;
      return;
    }
  }

  onSlideWillChange() {
    this.updateSliderProportions();
  }

  itemsWasSet() {
    this.updateSliderProportions();
  }

  updateSliderProportions() {
    const $el = $('page-adm-manage-product.ion-page .fixed-content');
    const slideH = $el.height();
    $('page-adm-manage-product .swiper-slide').height(slideH - 56 * 3);
    $('page-adm-manage-product .swiper-slide, .slide-zoom').css({'min-height': `${slideH - 56 * 3}px`});
    // $el.height( $('.swiper-slide-active').height() - $('reservation-bar').height());
    return slideH;
  }

  setDay(day: moment.Moment) {
    if (!day) {
      return;
    }
    this.day = day;
    this.dataDispatchOrders = {day: this.day, store: this.store};
  }

  updateBalanceDay(day: moment.Moment) {
    const today = moment();
    let diff = day.diff(today, 'days');
    if(today.isBefore(day)){
      diff += 1
    }
    this.loadingHelper.setLoading('updateBalanceDay', true);
    this.adminStoreService.balanceGeneral({
      store_id: this.store.id,
      page: diff,
      period_type: 'day'
    }).subscribe((e: any) => {
      this.storeBalance = e;
      this.loadingHelper.setLoading('updateBalanceDay', false);
    }, (e) => {
        this.loadingHelper.setLoading('updateBalanceDay', false);
        console.error(e);
      });
  }

  updateDeliveryEmployeesFilter(items: DispatchOrderAdminList[]) {
    const idListIn = [];
    const result = [];
    items.filter(item => item.del_emp_id).forEach((item) => {
      if (idListIn.indexOf(item.del_emp_id) !== -1) {
        return;
      }
      idListIn.push(item.del_emp_id);
      result.push({
        name: item.del_emp,
        id: item.del_emp_id,
      });
    });
    this.deliveryEmployeesFilter = result;
  }

  dispatchOrdersUpdated(items: DispatchOrderAdminList[]) {
    this.updateBalanceDay(this.day);
    this.updateDeliveryEmployeesFilter(items);
  }

  nextDay() {
    this.setDay(moment(this.day).add(1, 'd'));
  }

  prevDay() {
    this.setDay(moment(this.day).subtract(1, 'd'));
  }

  setupStyles() {
    this.renderer.addClass(this.rootContent, 'content-with-bottom-bar');
    this.renderer.addClass(this.rootContent, 'content-with-fixed-toolbar-top');
    this.renderer.addClass(this.rootContent, 'two-rows-bottom');
  }

  titleDateFilter(dt: moment.Moment) {
    if (moment(this.date.today(), 'DD-MM-YYYY').isSame(moment(dt, 'DD-MM-YYYY'))) {
      return this.todayTxt || '';
    }
    return dt.format('dddd');
  }

  headerBtnClick() {
    return this.router.navigate(['/add-operating-day-note'], {
      queryParams: {
        day: this.day,
        noteType: NoteTypeEnum.NORMAL
      }
    });
  } 

  async openEditInventoryModal() {
    this.fab.close();
    const resellerMode = this.slides[this.slider.activeIndex].id === this.SLIDE_RESALE;
    
    try {   
      const modal = await this.modalCtrl.create({
        component: EditInventoryDayItemsPage, // Substitua 'DayNotePopUpPage' pelo componente real
        componentProps: {
          day: this.day, resellerMode: resellerMode
        }
      });
      modal.present();
    } catch(e) {
      Raven.captureException(e);
    }
  }

  async openEditFilterModal() {
    try {   
      const modal = await this.modalCtrl.create({
        component: EditDispatchFilterPage, // Substitua 'DayNotePopUpPage' pelo componente real
        componentProps: {
          deliveryEmployeesFilter: this.deliveryEmployeesFilter
        }
      });
      modal.present();
    } catch(e) {
      console.error(e);
    }
  }

  hasError() {
    return this.error;
  }

  async openDatePicker() {
    try {
      const result = await DatePicker.present({
        mode: 'date', // Tipo de seleção (data)
        date: this.day.toISOString(), // Data inicial
        locale: 'pt-BR', // Localização para formato de data
      });
  
      if (result.value) {
        this.setDay(moment(new Date(result.value))); // Atualiza o dia selecionado
      }
    } catch (err) {
      console.error('Erro ao abrir o DatePicker:', err);
    }
  }

  startReorder() {
    this.reorder = true;
    this.fab.close();
  }

  saveReorder() {
    this.reorder = false;
    if (this.section === this.SLIDE_BREADS) {
      this.listProducts.saveReorder();
      return;
    }
    if (this.section === this.SLIDE_RESALE) {
      this.listResellersProducts.saveReorder();
      return;
    }
  }

  cancelReorder() {
    this.trans.get(['CANCEL', 'CANCEL_REORDER']).subscribe((val) => {
      this.alertHelper.confirm(
        val.CANCEL,
        val.CANCEL_REORDER,
      ).then((isConfirmed) => {
        if (isConfirmed) {
          this.reorder = false;
        }
      });
    });
  }

  startReorderProductsResellers() {
    this.startReorder();
  }

}
