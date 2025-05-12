import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { EventService } from '../../providers/event.service';
import {
  IonContent,
  ModalController,
  NavController,
  IonFab,
} from '@ionic/angular';
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
import {
  DeliveryEmployeeFilter,
  EditDispatchFilterPage,
} from '../edit-dispatch-filter/edit-dispatch-filter';
import { DispatchOrderAdminList } from '../../shared/models/dispatch-order.model';
import { Utils } from '../../utils/utils';
import { StoreBalance } from '../admin-balance-store/admin-balance-store';
import { AdminStoreService } from '../../providers/admin-store.service';
import { EditInventoryDayItemsPage } from '../edit-inventory-day-items/edit-inventory-day-items';

import { Subscription } from 'rxjs';
import { register } from 'swiper/element/bundle';

declare let $: any;

@Component({
  selector: 'page-adm-manage-product',
  templateUrl: './adm-manage-product.html',
  styleUrls: ['./adm-manage-product.scss'],
})
export class AdmManageProductPage implements OnInit, OnDestroy {
  @ViewChild('mySlider', { static: false }) sliderEl!: ElementRef;

  @ViewChild('rootContent', { static: false, read: ElementRef })
  rootContent!: ElementRef;

  @ViewChild('fab') fab: IonFab;

  @ViewChild(AdmListProductsInventoryComponent)
  listProducts: AdmListProductsInventoryComponent;

  @ViewChild(AdmListProductsResellersInventoryComponent)
  listResellersProducts: AdmListProductsResellersInventoryComponent;

  private subscriptions: Subscription[] = [];

  SLIDE_DISPATCH = 'dispatch';
  SLIDE_BREADS = 'breads';
  SLIDE_RESALE = 'resale';
  section = this.SLIDE_DISPATCH;
  page = 0;

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
    },
  ];

  set reorder(value: boolean) {
    this._reorder = value;
    if (this.sliderEl) {
      if (value) {
        this.sliderEl.nativeElement.swiper.allowSlideNext = false; // Bloqueia o swipe para frente
        this.sliderEl.nativeElement.swiper.allowSlidePrev = false; // Bloqueia o swipe para trás
      } else {
        this.sliderEl.nativeElement.swiper.allowSlideNext = true; // Permite o swipe para frente
        this.sliderEl.nativeElement.swiper.allowSlidePrev = true; // Permite o swipe para trás
      }
    }
  }

  get reorder(): boolean {
    return this._reorder;
  }

  constructor(
    public router: Router,
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
    private settingsService: SettingsService
  ) {
    this.trans.get('TODAY').subscribe((val) => (this.todayTxt = val));
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
    this.sliderEl.nativeElement.swiper.slideTo(0);
  };

  ngOnInit(): void {
    // Inicialização da tabela do gerenciador de carrinho
    this.cartManagerTable.init().then(() => {
      this.settingsService.getSettings().then((result: IUserSettings) => {
        this.init(result.store);
      });
    });

    // Assinaturas de eventos
    this.subscriptions.push(
      this.events.onEvent('storeChanged').subscribe((data) => {
        this.eventStoreChanged(data);
      })
    );

    this.subscriptions.push(
      this.events.onEvent('inventoryEdited').subscribe((data) => {
        this.eventInventoryEdited();
      })
    );
  }

  ngOnDestroy(): void {
    // Cancelar todas as assinaturas registradas
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  init(store: Store) {
    this.authService.getUser().then((user) => {
      this.user = user;
      if (!Utils.canAdminStore(user, store)) {
        return this.router.navigateByUrl('HomeList');
      }
      this.setupStyles();
      if (store) {
        this.setStore(store);
      } else {
        this.settingsService.getSettings().then((result: IUserSettings) => {
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
    // register();
    let selectedIndex = this.slides.findIndex((slide) => {
      register();
      return slide.id === segmentButton.detail.value;
    });

    this.sliderEl.nativeElement.swiper.slideTo(selectedIndex);
  }

  onSlideChanged(slider) {
    const currentSlide = this.slides[slider.target.swiper.activeIndex];

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
    if (!this.rootContent) return;

    const rootEl = this.rootContent.nativeElement;

    // Encontra o swiper-container e os slides
    const swiperContainer = rootEl.querySelector('swiper-container');
    if (!swiperContainer) return;

    const slides = swiperContainer.querySelectorAll('swiper-slide');

    // Altura disponível no conteúdo
    const contentHeight = rootEl.offsetHeight;

    // Altura estimada de 3 elementos fixos de 56px (header, footer, barra inferior, etc.)
    const reservedHeight = 56 * 3;

    const availableHeight = contentHeight - reservedHeight;

    // slides.forEach((slide: Element) => {
    //   const slideEl = slide as HTMLElement;
    //   slideEl.style.height = `${availableHeight}px`;

    //   // Se tiver algum elemento com .slide-zoom dentro do slide
    //   const zoomEl = slideEl.querySelector('.slide-zoom') as HTMLElement;
    //   if (zoomEl) {
    //     zoomEl.style.minHeight = `${availableHeight}px`;
    //   }
    // });
  }

  setDay(day: moment.Moment) {
    if (!day) {
      return;
    }
    this.day = day;
    this.dataDispatchOrders = { day: this.day, store: this.store };
  }

  updateBalanceDay(day: moment.Moment) {
    const today = moment();
    let diff = day.diff(today, 'days');
    if (today.isBefore(day)) {
      diff += 1;
    }
    this.loadingHelper.setLoading('updateBalanceDay', true);
    this.adminStoreService
      .balanceGeneral({
        store_id: this.store.id,
        page: diff,
        period_type: 'day',
      })
      .subscribe(
        (e: any) => {
          this.storeBalance = e;
          this.loadingHelper.setLoading('updateBalanceDay', false);
        },
        (e) => {
          this.loadingHelper.setLoading('updateBalanceDay', false);
          console.error(e);
        }
      );
  }

  updateDeliveryEmployeesFilter(items: DispatchOrderAdminList[]) {
    const idListIn = [];
    const result = [];
    items
      .filter((item) => item.del_emp_id)
      .forEach((item) => {
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
    this.renderer.addClass(
      this.rootContent.nativeElement,
      'content-with-bottom-bar'
    );
    this.renderer.addClass(
      this.rootContent.nativeElement,
      'content-with-fixed-toolbar-top'
    );
    this.renderer.addClass(this.rootContent.nativeElement, 'two-rows-bottom');
  }

  titleDateFilter(dt: moment.Moment) {
    if (
      moment(this.date.today(), 'DD-MM-YYYY').isSame(moment(dt, 'DD-MM-YYYY'))
    ) {
      return this.todayTxt || '';
    }
    return dt.format('dddd');
  }

  headerBtnClick() {
    return this.router.navigate(['/AddOperatingDayNotePage'], {
      queryParams: {
        day: this.day.toISOString(),
        noteType: NoteTypeEnum.NORMAL,
      },
    });
  }

  async openEditInventoryModal() {
    register();
    this.fab.close();
    const resellerMode =
      this.slides[this.sliderEl.nativeElement.swiper.activeIndex].id ===
      this.SLIDE_RESALE;

    try {
      const modal = await this.modalCtrl.create({
        component: EditInventoryDayItemsPage, // Substitua 'DayNotePopUpPage' pelo componente real
        componentProps: {
          day: this.day,
          resellerMode: resellerMode,
        },
      });
      modal.present();
    } catch (e) {
      Raven.captureException(e);
    }
  }

  async openEditFilterModal() {
    try {
      const modal = await this.modalCtrl.create({
        component: EditDispatchFilterPage, // Substitua 'DayNotePopUpPage' pelo componente real
        componentProps: {
          deliveryEmployeesFilter: this.deliveryEmployeesFilter,
        },
      });
      modal.present();
    } catch (e) {
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
    if (this.fab) {
      this.fab.close();
    }
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
      this.alertHelper
        .confirm(val.CANCEL, val.CANCEL_REORDER)
        .then((isConfirmed) => {
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
