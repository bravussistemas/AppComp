import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
} from '@angular/platform-browser';
import { ErrorHandler, LOCALE_ID, NgModule, Injectable } from '@angular/core';
import { IonApp, IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './providers/auth-service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { StorageUtils } from './utils/storage-utils';
import { LoadingHelper } from './utils/loading-helper';
import { AlertHelper } from './utils/alert-helper';
import { LoggerService } from './providers/logger-service';
import { AuthHttp } from './providers/auth-http';
import { AppConfig } from '../configs';
import { ProductInventory } from './providers/product-inventory';
import { AuthUserHttp } from './providers/auth-user-http';
import { CartManager } from './providers/cart-manager';
import { DateService } from './providers/date-service';
import { SettingsService } from './providers/settings-service';
import { ToastHelper } from './utils/toast-helper';
import { StoreService } from './providers/store-service';
import { CacheInterceptor } from './providers/cache-interceptor';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FirebaseDbService } from './providers/firebase-db-service';
import { OperatingDaysNoteService } from './providers/operating-days-note.service';
import { CartManagerTable } from './providers/database/cart-manager-table';
import { DatabaseProvider } from './providers/database/database-provider';
import { DatabaseMigrations } from './providers/database/database-migrations';
import { CheckoutService } from './providers/checkout-service';
import { ProductService } from './providers/product.service';
import { UserProfileService } from './providers/user-profile.service';
import { CreditCardService } from './providers/credit-card.service';
import { PixService } from './providers/pix.service';
import { CreditCardDirectivesModule } from './libs/angular-cc-library/src/directives';
import { AdminStoreService } from './providers/admin-store.service';
import { DispatchOrderService } from './providers/dispatch-order.service';
import { SalesService } from './providers/sales.service';
import { SentryErrorHandler } from './utils/sentry-error-handler';
import { AngularFireModule } from '@angular/fire/compat';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
} from '@angular/common/http';
import { ProductInventoryChangesHandler } from './utils/product-inventory-changes-handler';
import { UserCreditService } from './providers/user-credit.service';
import { DatePipe } from '@angular/common';
import { AppMenuItemComponent } from './components/app-menu-item/app-menu-item';
import { AppMenuSecondaryItemComponent } from './components/app-menu-secondary-item/app-menu-secondary-item';
import { TrackHelper } from './providers/track-helper/track-helper';
import { UserAddressProvider } from './providers/user-address/user-address';
import { DeliveryState } from './providers/delivery-state/delivery-state';
import { GeoServiceProvider } from './providers/geo-service/geo-service';
import { DispatchFilterService } from './providers/dispatch-filter.service';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { AppConfigService } from './providers/app-config.service';
import { LastRequestService } from './providers/last-request-service';
import { AmplitudeService } from './providers/amplitude.service';
import { StoreSellerService } from './providers/store-seller.service';
import { StoreOptionsMenuPopoverComponent } from './components/store-options-menu-popover/store-options-menu-popover';
import * as Hammer from 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CouponsService } from './providers/coupons.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AppRoutingModule } from './app-routing.module';
import { CacheService } from 'ionic-cache';
import { CacheModule } from 'ionic-cache';
import { SharedModule } from './shared/shared.module';
import { HomePage } from './pages/home/home';
import { HomePageModule } from './pages/home/home.module';
import { ListHistoryUserPurchaseModule } from './pages/list-history-user-purchase/list-history-user-purchase.module';
import { EditInventoryDayItemsPageModule } from './pages/edit-inventory-day-items/edit-inventory-day-items.module';
import { DetailHistoryUserPurchasePage } from './pages/detail-history-user-purchase/detail-history-user-purchase';
import { DetailHistoryUserPurchaseModule } from './pages/detail-history-user-purchase/detail-history-user-purchase.module';
import { DayNotePopUpPageModule } from './pages/day-note-pop-up/day-note-pop-up.module';
import { ChooseDeliveryEmployeePageModule } from './pages/choose-delivery-employee/choose-delivery-employee.module';
import { ChooseDeliveryAddressPageModule } from './pages/choose-delivery-address/choose-delivery-address.module';
import { AdminBalanceStorePageModule } from './pages/admin-balance-store/admin-balance-store.module';
import { LoginModule } from './pages/login/login.module';
import { ListUserSalesPageModule } from './pages/list-user-sales/list-user-sales.module';
import { SignInModule } from './pages/sign-in/sign-in.module';
import { ForgotPasswordModule } from './pages/forgot-password/forgot-password.module';
import { SignUpModule } from './pages/sign-up/sign-up.module';
import { CheckoutCompleteModule } from './pages/checkout-complete/checkout-complete.module';
import { CardErrorPopUpModule } from './pages/card-error-pop-up/card-error-pop-up.module';
import { ChooseDeliveryHourPageModule } from './pages/choose-delivery-hour/choose-delivery-hour.module';
import { ChooseScheduleDeliveryDateModule } from './pages/choose-schedule-delivery-date/choose-schedule-delivery-date.module';
import { CouponsRegisterPageModule } from './pages/coupons-register/coupons-register.module';
import { CuponsPageModule } from './pages/coupons/coupons.module';
import { ListCreditCardPageModule } from './pages/list-credit-card/list-credit-card.module';
import { RegisterCreditCardModule } from './pages/register-credit-card/register-credit-card.module';
import { RegisterDocumentNoteModule } from './pages/register-document-note/register-document-note.module';
import { RequestStatusPageModule } from './pages/request-status/request-status.module';
import { RegisterMobilePhoneModule } from './pages/register-mobile-phone/register-mobile-phone.module';
import { AddAddressPageModule } from './pages/add-address/add-address.module';
import { SearchStatePageModule } from './pages/search-state/search-state.module';
import { SearchAddressPageModule } from './pages/search-address/search-address.module';
import { SearchCityPageModule } from './pages/search-city/search-city.module';
import { ListBreadsPageModule } from './pages/list-breads/list-breads.module';
import { DetailProductModule } from './pages/detail-product/detail-product.module';
import { EditProductActivesModule } from './pages/edit-product-actives/edit-product-actives.module';
import { AdmManageProductPageModule } from './pages/adm-manage-product/adm-manage-product.module';
import { AdmManagerUserCreditsPageModule } from './pages/adm-manager-user-credits/adm-manager-user-credits.module';
import { AdmDetailUserCreditsPageModule } from './pages/adm-detail-user-credits/adm-detail-user-credits.module';
import { AddOperatingDayNotePageModule } from './pages/add-operating-day-note/add-operating-day-note.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Configuração do Firebase
export const firebaseConfig = {
  apiKey: 'AIzaSyDxmJtsSmxpmTHp80u06jZnXrUzumJcqDQ',
  authDomain: 'fir-oh-my-bread.firebaseapp.com',
  databaseURL: 'https://fir-oh-my-bread.firebaseio.com',
  projectId: 'firebase-oh-my-bread',
  storageBucket: 'firebase-oh-my-bread.appspot.com',
  messagingSenderId: '139965212713',
};

// Correção: Removido '@override'
@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    // Sobrescreva a configuração padrão do HammerJS
    swipe: { direction: Hammer.DIRECTION_ALL },
    pan: { direction: Hammer.DIRECTION_ALL },
  };
}

registerLocaleData(localePt);

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CreditCardDirectivesModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    CacheModule.forRoot(),
    AppRoutingModule,
    HomePageModule,
    ListHistoryUserPurchaseModule,
    EditInventoryDayItemsPageModule,
    DetailHistoryUserPurchaseModule,
    DayNotePopUpPageModule,
    LoginModule,
    ListUserSalesPageModule,
    SignInModule,
    ForgotPasswordModule,
    CardErrorPopUpModule,
    AdmManageProductPageModule,
    // AdmDetailUserCreditsPageModule,
    ChooseDeliveryHourPageModule,
    ChooseDeliveryAddressPageModule,
    RegisterMobilePhoneModule,
    ListCreditCardPageModule,
    AdmManagerUserCreditsPageModule,
    RegisterCreditCardModule,
    RegisterDocumentNoteModule,
    RequestStatusPageModule,
    ListBreadsPageModule,
    DetailProductModule,
    EditProductActivesModule,
    AddAddressPageModule,
    SearchStatePageModule,
    SearchAddressPageModule,
    SearchCityPageModule,
    ChooseScheduleDeliveryDateModule,
    CouponsRegisterPageModule,
    CuponsPageModule,
    SignUpModule,
    CheckoutCompleteModule,
    ChooseDeliveryEmployeePageModule,
    ChooseDeliveryAddressPageModule,
    AdminBalanceStorePageModule,
    AddOperatingDayNotePageModule,
    // Removido: CacheInterceptor,
    // Removido: HttpClient do array de imports
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    AppComponent,
    AppMenuItemComponent,
    AppMenuSecondaryItemComponent,
    StoreOptionsMenuPopoverComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    // Adicionado provideHttpClient() nos providers
    provideHttpClient(),
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
    CacheService,
    DatePipe,
    AuthService,
    StorageUtils,
    SalesService,
    LoadingHelper,
    CartManagerTable,
    DatabaseProvider,
    AlertHelper,
    LoggerService,
    UserProfileService,
    UserCreditService,
    DispatchFilterService,
    CreditCardService,
    PixService,
    LastRequestService,
    AmplitudeService,
    AuthHttp,
    AuthUserHttp,
    ProductInventory,
    CheckoutService,
    DatabaseMigrations,
    CartManager,
    ProductService,
    AppConfigService,
    AdminStoreService,
    DispatchOrderService,
    AppConfig,
    OperatingDaysNoteService,
    FirebaseDbService,
    SettingsService,
    StoreSellerService,
    TrackHelper,
    ProductInventoryChangesHandler,
    DateService,
    ToastHelper,
    StoreService,
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
    TrackHelper,
    UserAddressProvider,
    DeliveryState,
    GeoServiceProvider,
    LaunchNavigator,
    CouponsService,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
  ],
})
export class AppModule {}
