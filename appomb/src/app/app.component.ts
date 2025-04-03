import {
  Component,
  isDevMode,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AlertController,
  ModalController,
  Platform,
  NavController,
  IonRouterOutlet,
} from '@ionic/angular';
import { EventService } from './providers/event.service';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './providers/auth-service';
import { User } from './shared/models/user.model';
import { LoadingHelper } from './utils/loading-helper';
import { SettingsService } from './providers/settings-service';
import { AppConfig } from '../configs';
import { Store, StoreTypeEnum } from './shared/models/store.model';
import { CacheService } from 'ionic-cache';
import { DatabaseProvider } from './providers/database/database-provider';
import { FirebaseDbService } from './providers/firebase-db-service';
import { StoreService } from './providers/store-service';
import { Share } from '@capacitor/share';
//import { SocialSharing } from '@ionic-native/social-sharing';
//import { AppVersion } from '@ionic/core';
import { App } from '@capacitor/app';
import * as Raven from 'raven-js';
import { ToastHelper } from './utils/toast-helper';
import { ProductInventoryChangesHandler } from './utils/product-inventory-changes-handler';
import { Keyboard } from '@capacitor/keyboard';
import { PluginListenerHandle } from '@capacitor/core';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { IFirebaseStoresDb, IUserSettings, Page } from './shared/interfaces';
import { Utils } from './utils/utils';
import * as moment from 'moment';
import { AlertHelper } from './utils/alert-helper';
import { DatePipe } from '@angular/common';
import { OperatingDaysNote } from './shared/models/operating-day-note.model';
import { UserCreditService } from './providers/user-credit.service';
import { CartManagerTable } from './providers/database/cart-manager-table';
import { TrackHelper } from './providers/track-helper/track-helper';
import { DeliveryState } from './providers/delivery-state/delivery-state';
import { FIRST_PAGE_APP } from './shared/constants';
import { AppConfigService } from './providers/app-config.service';
import { AmplitudeService } from './providers/amplitude.service';
import { OneSignalNotificationHandlerService } from './providers/onesignal-notification-handler.service';

import { Capacitor } from '@capacitor/core';

declare let cordova: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnDestroy, OnInit {
  private keyboardWillShowListener: PluginListenerHandle;
  private keyboardWillHideListener: PluginListenerHandle;
  versaoApp: String;

  rootPage = '';
  pages: Array<Page>;
  pagesAdmin: Array<Page>;
  pagesStoreSales: Array<Page>;
  pagesDeliveryEmployee: Array<Page>;
  pagesFooter: Array<Page>;
  version: string;
  user: User;
  store: Store;
  storeCount = null;
  homePage = FIRST_PAGE_APP;
  userIsLoggedIn = false;
  allSubs = new Subscription();
  showedAlert = false;
  confirmAlert: any;
  userCreditBalance: number;
  userCreditBalanceError = false;
  autoCloseAppTimeout;

  constructor(
    public platform: Platform,
    public router: Router,
    private navController: NavController,
    public auth: AuthService,
    private storage: Storage,
    private trackHelper: TrackHelper,
    public events: EventService,
    trans: TranslateService,
    private cartManagerTable: CartManagerTable,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public storeService: StoreService,
    public loadingHelper: LoadingHelper,
    private appConfig: AppConfig,
    //private keyboard: Keyboard,
    //private appVersion: AppVersion,
    private amplitude: AmplitudeService,
    public datePipe: DatePipe,
    private userCreditService: UserCreditService,
    public alertHelper: AlertHelper,
    public toastHelper: ToastHelper,
    private productInventoryChangesHandler: ProductInventoryChangesHandler,
    private firebaseService: FirebaseDbService,
    private deliveryState: DeliveryState,
    private appConfigService: AppConfigService,
    cache: CacheService,
    private database: DatabaseProvider,
    private settingsService: SettingsService
  ) {
    trans.setDefaultLang('pt');
    trans.use('pt');

    const ADMIN: Page = {
      title: 'SIDE_MENU.ADMIN',
      component: 'AdmManageProductPage',
      icon: 'barcode',
      onlyAdmin: true,
    };

    const DELIVERY_EMPLOYEE: Page = {
      title: 'SIDE_MENU.DELIVERY_EMPLOYEE',
      component: 'ListDispatchDeliveryPage',
      icon: 'md-bicycle',
      onlyDeliveryEmployee: true,
    };

    const USER_CREDIT: Page = {
      title: 'SIDE_MENU.USER_CREDIT',
      component: 'AdmManagerUserCreditsPage',
      icon: 'cash',
      onlyAdmin: true,
    };

    const ABOUT: Page = {
      title: 'Sobre',
      component: 'AboutPage',
      icon: 'md-information-circle',
      onlyLogged: false,
    };

    const COUPONS: Page = {
      title: 'Cupons',
      component: 'CouponsPage',
      icon: 'md-bookmark',
      onlyLogged: true,
    };

    const HISTORY_PURCHASE: Page = {
      title: 'SIDE_MENU.HISTORY_PURCHASE',
      component: 'UserRequestsHistoryPage',
      icon: 'time',
      onlyLogged: true,
    };

    const CREDIT_CARDS: Page = {
      title: 'SIDE_MENU.PAYMENT',
      component: 'ListCreditCardPage',
      icon: 'card',
      onlyLogged: true,
    };

    cache.setDefaultTTL(60 * 60); //set default cache TTL for 1 hour

    // used for an example of ngFor and navigation
    this.pagesAdmin = [ADMIN];
    this.pagesStoreSales = [USER_CREDIT];
    this.pagesDeliveryEmployee = [DELIVERY_EMPLOYEE];
    this.pages = [HISTORY_PURCHASE, COUPONS];
    if (this.appConfig.SHOW_ABOUT_PAGE) {
      this.pages.push(ABOUT);
    }
    this.pagesFooter = [CREDIT_CARDS];

    this.database.init().then(() => {
      this.initializeApp(true);
    });
  }

  ngOnDestroy() {
    if (this.keyboardWillShowListener) {
      this.keyboardWillShowListener.remove();
    }
    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove();
    }
  }

  ngOnInit() {
    this.initializeBackButtonCustomHandler();
  }

  initializeBackButtonCustomHandler(): void {
    this.platform.ready().then(() => {
      App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
    });

    // this.platform.backButton.subscribeWithPriority(10, async () => {
    //   const currentUrl = this.router.url;
    //   const rootUrl = '/home'; // Altere para sua rota inicial

    //   if (currentUrl === rootUrl) {
    //     if (!this.showedAlert) {
    //       this.showedAlert = true;
    //       await this.presentExitConfirm();
    //     } else if (this.confirmAlert) {
    //       // Se o alerta já estiver visível, feche-o
    //       await this.confirmAlert.dismiss();
    //       this.showedAlert = false;
    //     }
    //   } else {
    //     // Se puder voltar para a página anterior
    //     if (window.history.length > 1) {
    //       window.history.back();
    //     } else {
    //       // Se não houver histórico, sai do app
    //       navigator['app'].exitApp();
    //     }
    //   }
    // });
  }

  initializeApp(firstInit = false) {
    this.platform.ready().then(() => {
      if (this.appConfig.DEBUG) {
        // this.homePage = 'ChooseDeliveryAddressPage';
      }

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.debug('isDevMode:', isDevMode());

      this.loadAppConfig();

      if (firstInit) {
        //SplashScreen.hide();
        this.setUpKeyboardListeners();
        this.setVersionApp();
        this.settingsService.setInitialLanguage();
        if (Capacitor.isNativePlatform) {
          //StatusBar.styleDefault();
          //StatusBar.setOverlaysWebView({overlay:false});
          //StatusBar.setBackgroundColor({color:this.appConfig.STATUSBAR_COLOR});
        }

        // Confirm exit
        // this.platform.registerBackButtonAction(() => {
        //   if (this.router.length() == 1) {
        //     if (!this.showedAlert) {
        //       this.confirmExitApp();
        //     } else {
        //       this.showedAlert = false;
        //       this.confirmAlert.dismiss();
        //     }
        //   }
        //   if (this.nav.length() > 1) {
        //     this.nav.pop();
        //   }
        // });

        // this.initNetworkWatch();
        this.initPush();

        //
        // USER LOGIN SUBSCRIPTION
        //
        this.events.onEvent('userLogIn').subscribe(() => {
          console.debug('userLogIn received!');
          this.checkLogin();
        });

        //
        // USER LOGOUT SUBSCRIPTION
        //
        this.events.onEvent('userLogOut').subscribe(() => {
          console.debug('userLogOut received!');
          this.initializeApp();
          this.store = null;
          this.clearDeliveryState();
        });

        //
        // STORE CHANGE SUBSCRIPTION
        //
        this.events.onEvent('changeStore').subscribe((store: Store) => {
          console.debug('changeStore received!');
          this.setStore(store);
          this.sendOneSignalTags();
        });

        //
        // STORE CHANGE SUBSCRIPTION
        //
        this.events.onEvent('userChooseStore').subscribe((store: Store) => {
          console.debug('userChooseStore received!');
          this.store = store;
        });

        //
        // USER CREDIT CHANGED
        //
        this.events.onEvent('userCreditChanged').subscribe((store: Store) => {
          console.debug('userCreditChanged received!');
          this.loadUserCredit();
        });

        this.auth.userChange$.subscribe(() => {
          this.auth.getUser().then((user) => {
            this.user = user;
          });
        });

        this.handleAppPauseAndResume();
      } else {
        this.navController.navigateRoot(this.rootPage);
      }

      this.checkLogin();
    });
  }

  async presentExitConfirm() {
    this.confirmAlert = await this.alertCtrl.create({
      header: 'Exit App',
      message: 'Do you want to exit the application?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.showedAlert = false;
          },
        },
        {
          text: 'Exit',
          handler: () => {
            navigator['app'].exitApp();
          },
        },
      ],
    });

    await this.confirmAlert.present();
  }

  loadAppConfig() {
    return this.appConfigService.getActive().subscribe((data) => {
      console.log('App config loaded: ');
      console.log(data);
    });
  }

  private async setUpKeyboardListeners() {
    if (this.platform.is('capacitor')) {
      try {
        // Listen to keyboard will show event
        this.keyboardWillShowListener = await Keyboard.addListener(
          'keyboardWillShow',
          (info) => {
            document.body.classList.add('keyboard-is-open');
            // Optionally, handle keyboard height or other info
            // console.log('Keyboard will show with height:', info.keyboardHeight);
          }
        );

        // Listen to keyboard will hide event
        this.keyboardWillHideListener = await Keyboard.addListener(
          'keyboardWillHide',
          () => {
            document.body.classList.remove('keyboard-is-open');
          }
        );
      } catch (error) {
        console.error('Error setting up keyboard listeners:', error);
      }
    }
  }

  navigateToProfileOrLogin() {
    if (this.userIsLoggedIn) {
      this.router.navigate(['/UserProfilePage']);
    } else {
      this.router.navigate(['/Login']);
    }
  }

  get appName() {
    return this.appConfig.APP_NAME;
  }

  setStore(store: Store) {
    this.store = store;
    this.settingsService.chooseStore(store);
  }

  clearDeliveryState() {
    this.deliveryState.clearState();
  }

  refreshUserCreditBalance(event) {
    event.stopPropagation();
    if (this.loadingHelper.isLoading('userCreditBalance')) {
      return;
    }
    this.loadUserCredit();
  }

  loadUserCredit() {
    this.loadingHelper.setLoading('userCreditBalance', true);
    this.userCreditService.getMyBalance().subscribe(
      (resp) => {
        console.log(resp);
        this.loadingHelper.setLoading('userCreditBalance', false);
        this.userCreditBalance = resp.balance;
        this.userCreditBalanceError = false;
      },
      (e) => {
        console.error(e);
        this.userCreditBalanceError = true;
      }
    );
  }

  async initPush() {
    if (this.platform.is('capacitor')) {
      try {
        // Replace YOUR_ONESIGNAL_APP_ID with your OneSignal App ID
        // OneSignal.initialize("YOUR_ONESIGNAL_APP_ID");
        // OneSignal.Notifications.addEventListener('click', async (e) => {
        //   let clickData = await e.notification;
        //   console.log("Notification Clicked : " + clickData);
        // })
        // OneSignal.Notifications.requestPermission(true).then((success: Boolean) => {
        //   console.log("Notification permission granted " + success);
        // })
      } catch (error) {
        console.error('Erro ao inicializar push notifications:', error);
      }
    } else {
      console.log('Push notifications não suportado fora do Capacitor.');
    }
  }

  handleAppPauseAndResume() {
    if (!this.platform.is('cordova')) {
      return;
    }
    //Subscribe on pause
    const minutesToClose = 10;
    this.platform.pause.subscribe(() => {
      console.debug('App is put in background...');
      this.autoCloseAppTimeout = setTimeout(() => {
        console.debug('exiting from the app! Bye!');
        this.cartManagerTable.clear();
        this.navController.navigateRoot(this.homePage);
      }, 60 * 1000 * minutesToClose);
    });

    //Subscribe on resume
    this.platform.resume.subscribe(() => {
      console.debug('App is put in foreground...');
      if (this.autoCloseAppTimeout) {
        clearTimeout(this.autoCloseAppTimeout);
        this.autoCloseAppTimeout = null;
      }
    });
  }

  savePushToken() {
    // if (this.platform.is('cordova')) {
    //   // saving push notification to user// Adiciona um observador para alterações na inscrição
    //   OneSignal.addSubscriptionObserver((subscriptionState) => {
    //     if (subscriptionState.to.isSubscribed) {
    //       // O usuário está inscrito para receber notificações
    //       const userId = subscriptionState.to.userId;
    //       const pushToken = subscriptionState.to.pushToken;
    //       // Aqui você pode adicionar a lógica para salvar o userId e pushToken
    //       if (userId && pushToken) {
    //         this.auth.savePushToken({userId, pushToken}).subscribe(
    //           () => console.debug('Push Token Saved!'),
    //           e => console.error(e)
    //         );
    //       }
    //     }
    //   });
    // }
  }

  async obterVersaoApp() {
    const info = await App.getInfo();
    this.versaoApp = info.version;
    console.log('Versão do App:', this.versaoApp);
  }

  saveAppVersion() {
    if (this.platform.is('cordova')) {
      this.obterVersaoApp().then((version) => {
        this.auth.updateAppVersion(version).subscribe(
          () => console.debug(`App version saved!`),
          (e) => console.error(e)
        );
      });
    } else {
      this.auth.updateAppVersion('1.2.3-test').subscribe(
        () => console.debug(`App version saved!`),
        (e) => console.error(e)
      );
    }
  }

  setVersionApp() {
    if (this.platform.is('cordova')) {
      App.getInfo().then((version) => {
        this.version = version.build;
      });
    }
  }

  checkLogin() {
    this.auth
      .loggedIn(true)
      .then((isLoggedIn) => {
        if (!isLoggedIn) {
          return this.userNotAuth();
        }
        return this.userIsAuth();
      })
      .catch((e) => {
        this.loadingHelper.hide();
        Raven.captureException(e);
      });
  }

  userIsAuth() {
    this.userIsLoggedIn = true;
    console.debug('User is auth, continue ...');
    this.savePushToken();
    this.saveAppVersion();
    this.loadUserCredit();
    this.watchFirebaseChanges();
    // sync user settings
    this.auth
      .getUser()
      .then((user) => {
        if (Utils.isObjectEmpty(user) || Utils.isNullOrUndefined(user)) {
          this.auth.logout();
        } else {
          console.debug('then getUser', user);
          this.user = user;
          this.watchDeliveryEndedChanges(user);
          this.updateSettings();
          this.sendOneSignalTags();
          this.setupSentryUserData();
          this.setupAmplitudeUserData();
        }
      })
      .catch((e) => {
        console.error('getUser', e);
        this.loadingHelper.hide();
        Raven.captureException(e);
      });
  }

  userNotAuth() {
    this.userIsLoggedIn = false;
    this.user = null;
    this.userCreditBalance = null;
    this.watchFirebaseChanges();
    this.updateSettings();
    // OneSignal.User.addTag('admin', 'false');
  }

  sendOneSignalTags() {
    if (this.platform.is('cordova')) {
      if (!Utils.isNullOrUndefined(this.user) && this.user.is_staff) {
        // OneSignal.User.addTag('admin', this.user.is_staff.toString());
      }
      if (!Utils.isNullOrUndefined(this.store) && this.store.id) {
        // OneSignal.User.addTag('store_id', this.store.id.toString());
      }
    }
  }

  setupAmplitudeUserData() {
    if (!Utils.isNullOrUndefined(this.user)) {
      this.amplitude.setUser(this.user);
    }
  }

  setupSentryUserData() {
    if (this.platform.is('cordova')) {
      if (!Utils.isNullOrUndefined(this.user)) {
        Raven.setUserContext({
          email: this.user.email,
          id: this.user.id,
        });
      }
    }
  }

  checkDeviceDate(serverDate: Date) {
    // fixme: change the app to work with this date, returned by server
    const today = new Date();
    if (
      !(
        today.getDate() === serverDate.getDate() &&
        today.getFullYear() === serverDate.getFullYear() &&
        today.getMonth() === serverDate.getMonth()
      )
    ) {
      this.trackHelper.trackByName(TrackHelper.EVENTS.WRONG_DATE_WARNING, {
        date: today.toString(),
      });
      this.alertHelper.show(
        'Data do aparelho incompatível!',
        `A data do seu aparelho parece diferente da data que operamos em nossas lojas,
              você pode enfrentar alguns problemas para visualizar nossos produtos e efetuar compras.
              <hr>
              <b>Data do aparelho:</b> ${this.datePipe.transform(
                today,
                'shortDate'
              )}<br>
              <b>Data das nossas lojas:</b> ${this.datePipe.transform(
                serverDate,
                'shortDate'
              )}`
      );
    }
  }

  updateSettings() {
    this.settingsService.refreshSettings({ with_dispatch_info: true }).then(
      async (res) => {
        if (Utils.isNullOrUndefined(res)) {
          this.auth.logout();
          return;
        }

        if (res.server_date) {
          this.checkDeviceDate(moment(res.server_date).toDate());
        }

        if (!res.store) {
          // USER NOT CHOOSE STORE YET
          if (!this.userIsLoggedIn) {
            return this.setInitialRootPage(FIRST_PAGE_APP);
          }
          const settings = await this.settingsService.getSettings();
          if (!settings.store) {
            return this.setInitialRootPage(FIRST_PAGE_APP);
          }
          return await this.settingsService
            .updateSettings({ store: settings.store })
            .then(() => {
              return this.updateSettings();
            })
            .catch(this.handlerError.bind(this));
        }

        // USER ALREADY CHOOSE A STORE
        if (this.store && res.store) {
          if (this.store.id !== res.store.id) {
            // store switch detected, we need to reset user cart to avoid wrong store buy error
            this.cartManagerTable.clear();
          }
        }

        this.setStore(res.store);

        if (!this.userIsLoggedIn) {
          // user not logged in, redirect to home
          return this.setInitialRootPage(this.homePage);
        }

        // check if the client has a dispatch order today
        this.storage
          .get('GO_TO_AFTER_LOGIN')
          .then((val) => {
            let gotToPage = this.homePage;
            // if (res && res.dispatch_today_store_ids && res.dispatch_today_store_ids.indexOf(res.store_id) !== -1) {
            //   // user has dispatch today, redirect to sales
            //   if (this.store && this.store.store_type != StoreTypeEnum.DELIVERY) {
            //     gotToPage = 'ListHistoryUserPurchasePage';
            //   }
            // } else
            if (!Utils.isNullOrUndefined(val)) {
              gotToPage = val;
            }
            this.setInitialRootPage(gotToPage);
            this.storage.remove('GO_TO_AFTER_LOGIN');
          })
          .catch(this.handlerError.bind(this));
      },
      (e) => {
        if (e && (e.status === 401 || e.status === 400)) {
          this.auth.logout();
          return;
        }
        this.setInitialRootPage(this.homePage);
        this.handlerError(e);
      }
    );
  }

  async setInitialRootPage(
    page: string,
    isRetry: boolean = false
  ): Promise<void> {
    try {
      const currentUrl = this.router.url;
      // Normalize URLs to ensure consistent comparison
      const normalizedCurrentUrl = this.normalizeUrl(currentUrl);
      const normalizedPage = this.normalizeUrl(page);

      if (normalizedCurrentUrl === normalizedPage) {
        console.debug(`setInitialRootPage: already '${page}' as root.`);
        return;
      }
    } catch (e) {
      // Alternatively, use console.error as a fallback
      console.error('Error in setInitialRootPage:', e);
    }

    // Fallback to homePage if no page is provided
    const targetPage = page || this.homePage;

    try {
      await this.navController.navigateRoot(targetPage, { animated: true });
      // Hide any loading indicators
      this.loadingHelper.hide();
      console.debug(`Navigated to root page: '${targetPage}'.`);
    } catch (error) {
      console.error(`Failed to navigate to '${targetPage}':`, error);
      // Retry navigation to homePage once
      if (!isRetry) {
        console.debug(`Retrying navigation to home page: '${this.homePage}'.`);
        await this.setInitialRootPage(this.homePage, true);
      } else {
        console.error(`Failed to navigate to home page: '${this.homePage}'.`);
      }
    }
  }

  /**
   * Normalizes a URL by removing query parameters and trailing slashes.
   * @param url - The URL to normalize.
   * @returns The normalized URL.
   */
  private normalizeUrl(url: string): string {
    if (!url) return '';
    // Remove query parameters and hash fragments
    const urlWithoutQuery = url.split('?')[0].split('#')[0];
    // Remove trailing slash
    return urlWithoutQuery.endsWith('/')
      ? urlWithoutQuery.slice(0, -1)
      : urlWithoutQuery;
  }

  openPage(page: any, asRoot = true) {
    // If the page object contains a component, extract it
    if (page && page.component) {
      page = page.component;
    }

    // Track the page navigation event
    this.trackHelper.trackByName(
      `${TrackHelper.EVENTS.OPEN_PAGE} ${page.toString()}`
    );

    if (asRoot) {
      // Navigate to the page as the root, replacing the current navigation stack
      this.navController.navigateRoot(page);
    } else {
      // Navigate forward by pushing the page onto the navigation stack
      this.navController.navigateForward(page, { animated: true });
    }
  }

  watchFirebaseChanges() {
    this.allSubs.add(
      this.firebaseService
        .watchStoresChanges()
        .subscribe((e: IFirebaseStoresDb) => {
          console.debug('watchStoresChanges', e);
          this.storeCount = e.storeCount;
          this.storage.get('LAST_STORE_UPDATED').then((val) => {
            this.settingsService.getSettings().then(
              (result: IUserSettings) => {
                if (
                  e.storeIds &&
                  result.store_id &&
                  e.storeIds.indexOf(result.store_id) === -1
                ) {
                  // user store was removed by an admin, redirect user to select a new store.
                  this.navController.navigateRoot(FIRST_PAGE_APP, {
                    queryParams: { afterCurrentStoreDeleted: true },
                  });
                }
              },
              (error) => {
                Raven.captureException(error);
              }
            );

            if (!val || val !== e.modified) {
              this.storage.set('LAST_STORE_UPDATED', e.modified).then(() => {
                this.storeService.clean();
              });
            }
          });
        })
    );
    this.settingsService.getSettings().then((result: IUserSettings) => {
      if (result.store_id) {
        this.allSubs.add(
          this.firebaseService.watchInventoryChanges().subscribe((resp) => {
            this.productInventoryChangesHandler.handle(resp);
          })
        );
      }
    });
  }

  watchDeliveryEndedChanges(user: User) {
    let isFirst = true;
    this.allSubs.add(
      this.firebaseService.watchDeliveryEndedChanges().subscribe((e: any) => {
        if (isFirst) {
          isFirst = false;
          return;
        }
        if (!this.store) {
          return;
        }
        if (!this.canAdminStore(user, this.store)) {
          return;
        }
        const fromStore = e[this.store.id];
        if (fromStore && fromStore.users) {
          if (fromStore.users.indexOf(user.id) !== -1) {
            this.alertHelper.show(
              'Entregador finalizou última entrega!',
              `O entregador <b>${fromStore.employee}</b> avisou que fez sua última entrega em <strong>${fromStore.address}</strong>.`
            );
          }
        }
      })
    );
  }

  logout() {
    this.auth.logout();
  }

  share() {
    Share.share({
      text: `Oi, veja que legal o aplicativo dessa panificadora artesanal de fermentação natural aqui em Joinville 👉 ${this.appConfig.APP_ONE_LINK}`,
    });
    this.trackHelper.trackByName(TrackHelper.EVENTS.APP_SHARE);
  }

  contact() {
    if (!this.platform.is('cordova'))
      window.open('https://www.ohmybread.com/home', '_system', 'location=yes');
    else
      cordova.InAppBrowser.open(
        'https://www.ohmybread.com/home',
        '_system',
        'location=yes'
      );
  }

  goToListBreads() {
    this.navController.navigateForward('ListBreadsPage');
  }

  async openPrePaidInfo() {
    const note: OperatingDaysNote = {
      title: 'Pré-pago',
      message: `A compra de crédito pode ser realizada em qualquer loja ou ponto de venda.
      <br><br>
      Seu crédito no pré-pago pode ser resgatado em dinheiro a qualquer momento junto ao lojista.`,
    };

    // Track the event
    this.trackHelper.trackByName(TrackHelper.EVENTS.INIT_CONTACT);

    try {
      const modal = await this.modalCtrl.create({
        component: OperatingDaysNote,
        componentProps: { note },
      });
      await modal.present();

      // Optionally, handle data returned from the modal
      const { data } = await modal.onWillDismiss();
      if (data) {
        // Handle the returned data if any
        console.log('Modal data:', data);
      }
    } catch (error) {
      console.error('Error presenting modal', error);
    }
  }
  async confirmExitApp() {
    this.showedAlert = true;
    this.confirmAlert = await this.alertCtrl.create({
      header: 'Sair do aplicativo',
      message: 'Deseja fechar o aplicativo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.showedAlert = false;
          },
        },
        {
          text: 'Fechar aplicativo',
          handler: () => {
            App.exitApp();
          },
        },
      ],
    });
    await this.confirmAlert.present();
  }

  handlerError(e: any): void {
    console.info('MyApp.handlerError');
    console.error(e);
    // Hide any loading that is present
    this.loadingHelper.hide();

    if (Utils.equalString(this.router.url, '/dummy')) {
      // Replace '/dummy' with the actual route of 'DummyPage'
      this.setInitialRootPage(this.homePage);
    }
  }

  isAdminOrStoreSeller(user: User, store: Store) {
    return Utils.isAdminOrStoreSeller(user, store);
  }

  canAdminStore(user: User, store: Store) {
    return Utils.canAdminStore(user, store);
  }
}
