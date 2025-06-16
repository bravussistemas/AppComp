import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  IonContent,
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { ProductInventoryDay } from '../../shared/models/product-inventory-day.model';
import { LoadingHelper } from '../../utils/loading-helper';
import { DateService } from '../../providers/date-service';
import { SettingsService } from '../../providers/settings-service';
import { OperatingDay } from '../../shared/models/operating-day.model';
import { IUserSettings } from '../../shared/interfaces';
import { FirebaseDbService } from '../../providers/firebase-db-service';
import { Subscription } from 'rxjs';
import {
  NoteTypeEnum,
  OperatingDaysNoteService,
} from '../../providers/operating-days-note.service';
import {
  DeliveryTypeEnum,
  Store,
  StoreTypeEnum,
} from '../../shared/models/store.model';
import { CartManagerTable } from '../../providers/database/cart-manager-table';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { SalesService } from '../../providers/sales.service';
import { AuthService } from '../../providers/auth-service';
import { ToastHelper } from '../../utils/toast-helper';
import { OperatingDayNoteUtil } from '../../utils/operating-day-note-util';
import { OperatingDaysNote } from '../../shared/models/operating-day-note.model';
import { Utils } from '../../utils/utils';
import { User } from '../../shared/models/user.model';
import { parseItemsWithoutReseller } from '../../components/adm-list-products-inventory/adm-list-products-inventory';
import { filterItemsWithReseller } from '../../components/adm-list-products-resellers-inventory/adm-list-products-resellers-inventory';
import { ProductInventory } from '../../providers/product-inventory';
import { DatePicker } from '@capacitor-community/date-picker';
import { TrackHelper } from '../../providers/track-helper/track-helper';
import { StoreOptionsMenuPopoverComponent } from '../../components/store-options-menu-popover/store-options-menu-popover';
import { FIRST_PAGE_APP } from '../../shared/constants';
import { EventService } from 'src/app/providers/event.service';
import { DayNotePopUpPage } from '../day-note-pop-up/day-note-pop-up';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import type { Swiper as SwiperType } from 'swiper';
import { register } from 'swiper/element/bundle';

declare let $: any;

export let parseItemsWithStock = (
  items: ProductInventoryDay[],
  showInvisible = false
) => {
  return items.filter((item) => {
    return item.is_active && (item.is_visible || showInvisible);
  });
};

@Component({
  selector: 'app-page-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit, OnDestroy {
  enableSearch: boolean;
  searchText: string;

  get notePopUp(): OperatingDaysNote {
    return this._notePopUp;
  }

  set notePopUp(value: OperatingDaysNote | null) {
    if (!Utils.isNullOrUndefined(value)) {
      this.modalCtrl
        .create({
          component: DayNotePopUpPage,
          componentProps: { note: value },
        })
        .then((modal) => modal.present())
        .catch((error) => console.error(error));
    }
    this._notePopUp = value;
  }

  section: string = 'breads';

  othersAlreadyOpen = false;
  canRenderOthers = false;

  @ViewChild(IonContent) content: IonContent;
  @ViewChild('mySlider', { static: true }) sliderRef: ElementRef;

  slides: any;
  items: ProductInventoryDay[] = [];
  itemsSecondary: ProductInventoryDay[] = [];
  error = false;
  day: any = this.date.today();
  serverReturned = false;
  closedWeekDays: any[] = null;
  store: Store = <any>{};
  dayMessage: string;
  todayTxt: string;
  hasDispatchToday = false;
  saleState: any;
  user: User;
  dataDispatchOrders;

  itemsPerReseller: { [key: number]: ProductInventoryDay[] } = {};
  sellersIds: string[] = [];
  resellerOpen: string;

  private _notePopUp: OperatingDaysNote;
  protected noteSubtitle: OperatingDaysNote;

  alreadyWatchingOperatingNotesDaysChanges = false;

  watchOperatingNotesDaysChangesSub: Subscription;

  firebaseInventoryDay = new Subscription();

  slideChanging = false;

  constructor(
    private router: Router,
    private cartManagerTable: CartManagerTable,
    private renderer: Renderer2,
    public loadingHelper: LoadingHelper,
    private operatingDaysNoteService: OperatingDaysNoteService,
    private date: DateService,
    //private datePicker: DatePicker,
    private trans: TranslateService,
    private modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private auth: AuthService,
    private trackHelper: TrackHelper,
    private salesService: SalesService,
    private toastHelper: ToastHelper,
    private productInventory: ProductInventory,
    public events: EventService,
    private firebaseService: FirebaseDbService,
    private settingsService: SettingsService
  ) {
    this.slides = [
      {
        id: 'breads',
      },
      {
        id: 'others',
      },
    ];
    this.trans.get('TODAY').subscribe((val) => (this.todayTxt = val));
  }

  ngOnInit(): void {
    this.loadingHelper.setLoading('products', true);
    this.serverReturned = false;

    register();
  }

  eventStoreChanged = (store: Store) => {
    this.init(store);
  };

  async startSearch() {
    const contentElement = await this.content.getScrollElement();
    this.renderer.addClass(contentElement, 'content-with-fixed-toolbar-top');
    this.enableSearch = true;
  }

  async stopSearch() {
    const contentElement = await this.content.getScrollElement();
    this.renderer.removeClass(contentElement, 'content-with-fixed-toolbar-top');
    this.enableSearch = false;
    this.searchText = null;
  }

  ionViewWillEnter() {
    this.events.onEvent('storeChanged').subscribe(this.eventStoreChanged);

    this.cartManagerTable
      .init()
      .then(() => {
        this.init();
      })
      .catch(this.handlerError.bind(this));

    this.setupStyles();
    this.updateSliderProportions();
  }

  ionViewWillLeave() {
    this.events.unsubscribe('storeChanged');
  }

  updateSliderProportions() {
    // const $el = $('page-home.ion-page .fixed-content');
    // const slideH = $el.height();
    // $('page-home .swiper-slide').height(slideH - 56 * 2);
    // $('page-home .swiper-slide, page-home .slide-zoom').css({'min-height': `${slideH - 56 * 2}px`});
    // // $el.height( $('.swiper-slide-active').height() - $('reservation-bar').height());
    // return slideH;
  }

  ngOnDestroy(): void {
    this.firebaseInventoryDay.unsubscribe();
    if (!Utils.isNullOrUndefined(this.watchOperatingNotesDaysChangesSub)) {
      this.watchOperatingNotesDaysChangesSub.unsubscribe();
      this.watchOperatingNotesDaysChangesSub = null;
    }
  }

  get primaryTabLabel(): string {
    if (this.store && this.store.delivery_type == DeliveryTypeEnum.PIZZA) {
      return 'HOME_TABS.PIZZAS';
    }
    return 'HOME_TABS.BREADS';
  }

  get secondaryTabLabel(): string {
    if (this.store && this.store.delivery_type == DeliveryTypeEnum.PIZZA) {
      return 'HOME_TABS.OTHERS_PIZZAS';
    }
    return 'HOME_TABS.OTHERS';
  }

  init(store?: Store) {
    if (store) {
      this.setStore(store);
    } else {
      this.settingsService.getSettings().then((result: IUserSettings) => {
        if (!result || !result.store) {
          this.router.navigate(['/' + FIRST_PAGE_APP]);
        } else {
          this.setStore(result.store);
        }
      }, this.handlerError.bind(this));
    }
  }

  isAdminOrStoreSeller(user: User, store: Store) {
    return Utils.isAdminOrStoreSeller(user, store);
  }

  get hasOpenSaleToday() {
    return this.saleState && this.saleState.client_has_open_dispatch_today;
  }

  canGoCheckout = () => {
    //ENTENDER REGRA DE NEGOCIO COM O PESSOAL
    //ACERTAR FUNCOE COM O BRAVUSS
    console.log('User:', this.user);
    console.log('Store:', this.store);
    //if (false) {    
    if (this.section == 'breads' && !this.isAdminOrStoreSeller(this.user, this.store)) {
      try {
        this.trackHelper.trackByName(
          TrackHelper.EVENTS.REDIRECT_USER_TO_OTHERS_SALES,
          { store_id: this.store.id }
        );
      } catch (e) {
        console.error(e);
      }

      const swiperInstance = this.sliderRef?.nativeElement?.swiper;
      swiperInstance.slideTo(1);
      //aqui é false
      return false;
    }

    return true;
  };

  setStore(store: Store) {
    console.log(store);
    this.store = store;
    this.auth.getUser().then((user) => {
      console.log(user);

      this.user = user;
      if (this.isAdminOrStoreSeller(user, store)) {
        this.slides.push({
          id: 'dispatch',
        });
      }
      this.auth.loggedIn().then((isLoggedIn) => {
        if (isLoggedIn) {
          // check if the client has a dispatch order today
          this.salesService
            .loadUserSaleState(store.id)
            .toPromise()
            .then((resp) => {
              this.saleState = resp;
              this.setupStyles();
            })
            .catch(this.handlerError.bind(this));
        }
      });
      if (this.store && this.store.operating_days) {
        let operationDaysClosed = this.store.operating_days.filter(
          (value: OperatingDay) => {
            return value.is_closed === true;
          }
        );
        this.closedWeekDays = [];
        for (let i = 0; i < operationDaysClosed.length; i++) {
          let operating = operationDaysClosed[i];
          this.closedWeekDays.push(operating.weekday);
        }
        this.setDay(this.day);
      }
    });
  }

  onSegmentChanged(segmentButton) {
    this.content.scrollToTop(0);

    if (segmentButton.detail.value === 'others') {
      this.othersAlreadyOpen = true;
      setTimeout(() => {
        this.canRenderOthers = true;
      }, 200);
      this.trackHelper.trackByName(
        TrackHelper.EVENTS.CHOOSE_OTHERS_PRODUCTS_SEGMENT
      );
    }

    const selectedIndex = this.slides.findIndex((slide: any) => {
      return slide.id === segmentButton.detail.value;
    });

    const swiperInstance = this.sliderRef?.nativeElement?.swiper;
    swiperInstance?.slideTo(selectedIndex);
  }

  onSlideWillChange(e) {}

  onSlideChanged(slider: any) {
    const currentSlide = this.slides[slider.getActiveIndex()];

    if (currentSlide) {
      this.section = currentSlide.id;
      return;
    }
    this.updateSliderProportions();
  }

  setDay(day: moment.Moment) {
    if (!day) {
      return;
    }

    this.day = day;
    this.watchOperatingNotesDaysChanges(this.store.id);
    this.dayMessage = null;
    this.dataDispatchOrders = { day: this.day, store: this.store };

    this.operatingDaysNoteService.getDay(this.store.id, this.day).subscribe(
      (res) => {
        const note = OperatingDayNoteUtil.getByType(res, NoteTypeEnum.NORMAL);
        const notePopUp = OperatingDayNoteUtil.getByType(
          res,
          NoteTypeEnum.WARNING
        );
        if (this.operatingDaysNoteService.mustShowNote(notePopUp)) {
          this.notePopUp = notePopUp;
          this.operatingDaysNoteService.saveAsShowed(notePopUp);
        }
        this.noteSubtitle = OperatingDayNoteUtil.getByType(
          res,
          NoteTypeEnum.SUBTITLE
        );
        if (note && note.message) {
          this.dayMessage = note.message;
          this.loadingHelper.setLoading('products', false);
        } else {
          this.getInventoryDay();
        }
        this.setupStyles();
      },
      () => {
        this.getInventoryDay();
      }
    );
  }

  watchOperatingNotesDaysChanges(storeId) {
    if (!Utils.isNullOrUndefined(this.watchOperatingNotesDaysChangesSub)) {
      return;
    }
    this.watchOperatingNotesDaysChangesSub = this.firebaseService
      .watchOperatingNotesDaysChanges(storeId)
      .subscribe((result) => {
        if (this.alreadyWatchingOperatingNotesDaysChanges) {
          this.setDay(this.day);
        }
        this.alreadyWatchingOperatingNotesDaysChanges = true;
      });
  }

  getInventoryDay() {
    if (!this.day || !this.store) {
      return;
    }

    this.serverReturned = false;
    this.firebaseInventoryDay.unsubscribe();
    this.firebaseInventoryDay = new Subscription();

    this.firebaseInventoryDay.add(
      this.firebaseService.getDay(this.day, this.store.id).subscribe(
        (resp) => {
          this.loadingHelper.setLoading('products', false);
          this.setItems(resp);
        },
        (e) => {
          this.handlerError(e);
        }
      )
    );
  }

  async scrollToItem(elem: HTMLElement) {
    if (!elem) return;

    // Obter a posição do elemento na página
    const box = elem.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const clientTop = document.documentElement.clientTop || 0;
    const top = box.top + scrollTop - clientTop;

    // Calcular o offset ajustado
    const contentElement = await this.content.getScrollElement();
    const scrollOffset = Math.round(top) - contentElement.offsetTop - 110; // Ajuste de 110px

    // Scroll usando scrollToPoint
    this.content.scrollToPoint(0, scrollOffset, 500);
  }

  openReseller(event, resellerId: string, resellerName: string) {
    if (resellerId === this.resellerOpen) {
      this.resellerOpen = null;
      return;
    }

    this.resellerOpen = resellerId;

    setTimeout(() => {
      this.scrollToItem(event.target);
    }, 250);

    try {
      if (resellerName) {
        resellerName = resellerName.replace(/<\/?[^>]+(>|$)/g, '');
      }
      this.trackHelper.trackByName(TrackHelper.EVENTS.OPEN_PARTNER_RESELLER, {
        reseller_id: resellerId,
        reseller_name: resellerName,
      });
      if (resellerName) {
        this.trackHelper.trackByName(
          `${TrackHelper.EVENTS.OPEN_PARTNER_RESELLER} ${resellerName}`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  setItems(items: ProductInventoryDay[]) {
    let mainItems = [];
    let secondaryItems = [];
    if (items && items.length) {
      items = parseItemsWithStock(
        items,
        this.isAdminOrStoreSeller(this.user, this.store)
      );
      mainItems = parseItemsWithoutReseller(items);
      console.log(items);
      secondaryItems = filterItemsWithReseller(items);
      const { itemsPerReseller, sellersIds } =
        Utils.parseProductsPerReseller(secondaryItems);
      this.itemsPerReseller = itemsPerReseller;
      this.sellersIds = sellersIds;
    }
    this.items = mainItems;
    console.log(mainItems);
    console.log(secondaryItems);
    
    this.itemsSecondary = secondaryItems;
    this.serverReturned = true;
    setTimeout(() => {
      this.updateSliderProportions();
    }, 200);
  }

  hasError() {
    return this.error;
  }

  notHasDays() {
    return this.closedWeekDays !== null && this.closedWeekDays.length >= 7;
  }

  notHasPrimaryItems() {
    return this.serverReturned && !this.items.length;
  }

  notHasSecondaryItems() {
    return this.serverReturned && !this.itemsSecondary.length;
  }

  async setupStyles() {
    this.addContentClass();

    const elClass = this.hasOpenSaleToday ? 'two-half-rows' : 'one-half';
    const contentElement = await this.content.getScrollElement(); // Obtém o elemento DOM

    if (
      Utils.isNullOrUndefined(this.noteSubtitle) ||
      !this.noteSubtitle.message?.length
    ) {
      this.renderer.removeClass(contentElement, elClass);
    } else {
      this.renderer.addClass(contentElement, elClass);
    }
  }

  async addContentClass() {
    const contentElement = await this.content.getScrollElement(); // Obtém o elemento DOM

    this.renderer.addClass(contentElement, 'content-with-fixed-toolbar-top');
  }

  goToUserSales = () => {
    if (this.hasDispatchToday) {
      this.router.navigate(['/ListHistoryUserPurchasePage']);
    }
  };

  get enableAdminView() {
    return this.isAdminOrStoreSeller(this.user, this.store);
  }

  handlerError(e) {
    console.error(e);
    this.trans.get('GENERIC_ERROR').subscribe((val) => {
      this.toastHelper.show({ message: val });
    });
    this.loadingHelper.setLoading('products', false);
  }

  isDeliveryEmployee() {
    return (
      this.user &&
      this.store &&
      this.user.delivery_employee_id &&
      this.store.store_type == StoreTypeEnum.DELIVERY
    );
  }

  getHeaderAction() {
    if (
      this.isAdminOrStoreSeller(this.user, this.store) ||
      this.isDeliveryEmployee()
    ) {
      return {
        icon: 'settings',
        iconClass: '',
        handler: async (event: Event) => {
          const popover = await this.popoverCtrl.create({
            component: StoreOptionsMenuPopoverComponent,
            componentProps: {
              user: this.user,
              store: this.store,
            },
            event: event,
            translucent: true,
          });
          await popover.present();
        },
      };
    }
    if (this.hasOpenSaleToday) {
      return {
        icon: 'basket',
        iconClass: 'pending-sale-icon',
        handler: () => {
          this.goToUserRequests();
        },
      };
    }
    return {};
  }

  goToUserRequests() {
    this.router.navigate(['/UserRequestsHistoryPage']);
  }

  toggleProductDay(item: ProductInventoryDay) {
    item.loading = true;
    this.productInventory.changeVisibility(item.id, !item.is_visible).subscribe(
      () => {
        item.is_visible = !item.is_visible;
        item.loading = false;
      },
      () => {
        this.toastHelper.connectionError();
        item.loading = false;
      }
    );
  }

  async openTimePicker(item: ProductInventoryDay) {
    const currentDate = item.next_batch
      ? moment(item.next_batch).toDate()
      : new Date();

    try {
      const result = await DatePicker.present({
        mode: 'time',
        date: currentDate.toISOString(),
        is24h: true,
        //title: 'Novo horário',
        theme: 'THEME_DEVICE_DEFAULT_LIGHT', // Opções: 'THEME_HOLO_DARK', 'THEME_DEVICE_DEFAULT_LIGHT', etc.
        cancelText: 'Cancelar',
        doneText: 'OK',
      });

      if (result.value) {
        const selectedDate = new Date(result.value);

        item.loadingNextBatch = true;
        this.productInventory.changeNextBatch(item.id, selectedDate).subscribe(
          () => {
            item.next_batch = selectedDate.toISOString();
            item.loadingNextBatch = false;
          },
          () => {
            this.toastHelper.connectionError();
            item.loadingNextBatch = false;
          }
        );
      }
    } catch (error) {
      console.error('Erro ao abrir o seletor de horário:', error);
    }
  }
}
