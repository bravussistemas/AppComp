import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
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
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient } from '@angular/common/http';
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
import { StoreSellerService } from "./providers/store-seller.service";
import { StoreOptionsMenuPopoverComponent } from './components/store-options-menu-popover/store-options-menu-popover';
import * as Hammer from 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CouponsService } from './providers/coupons.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AppRoutingModule } from './app-routing.module';
import { CacheService } from 'ionic-cache';
import { CacheModule } from 'ionic-cache';

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
  messagingSenderId: '139965212713'
};

// Correção: Removido '@override'
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    // Sobrescreva a configuração padrão do HammerJS
    swipe: { direction: Hammer.DIRECTION_ALL },
    pan: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CreditCardDirectivesModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    CacheModule.forRoot(),
    AppRoutingModule,
    // Removido: CacheInterceptor,
    // Removido: HttpClient do array de imports
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AppComponent,
    AppMenuItemComponent,
    AppMenuSecondaryItemComponent,
    StoreOptionsMenuPopoverComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    // Adicionado provideHttpClient() nos providers
    provideHttpClient(),
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
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
      useValue: 'pt-BR'
    },
    TrackHelper,
    UserAddressProvider,
    DeliveryState,
    GeoServiceProvider,
    LaunchNavigator,
    CouponsService,    
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
  ]
})
export class AppModule { }

