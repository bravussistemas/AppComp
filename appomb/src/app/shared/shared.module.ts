import { NgModule } from '@angular/core';
import { PageMessageBox } from '../components/page-message-box/page-message-box';
import { LongPress } from './long-press';
import { Header } from '../components/header/header';
import { ItemCartAmount } from '../components/item-cart-amount/item-cart-amount';
import { TipOnTap } from '../components/tip-on-tap/tip-on-tap';
import { ProductImg } from '../components/product-img/product-img';
import { ProductDetails } from '../components/product-details/product-details';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { TranslateModule } from '@ngx-translate/core';
import { ReservationBar } from '../components/reservation-bar/reservation-bar';
import { Moment } from 'moment';
import { AdmProductAmountControl } from '../components/adm-product-amount-control/adm-product-amount-control';
import { BrandIconComponent } from '../components/brand-icon/brand-icon';
import { ProductCategoryFilterPipe } from '../pipes/product-category-filter/product-category-filter';
import { AdmListProductsInventoryComponent } from '../components/adm-list-products-inventory/adm-list-products-inventory';
import { AdmListDispatchOrdersComponent } from '../components/adm-list-dispatch-orders/adm-list-dispatch-orders';
import { AdmDispatchListItemComponent } from '../components/adm-dispatch-list-item/adm-dispatch-list-item';
import { TransactionStatusPipe } from '../pipes/transaction-status/transaction-status';
import { ClientComingBar } from '../components/client-coming-bar/client-coming-bar';
import { ProductInventoryDayFilterPipe } from '../pipes/product-inventory-day-filter/product-inventory-day-filter';
import { DispatchOrderFilterPipe } from '../pipes/dispatch-order-filter/dispatch-order-filter';
import { PageNoteComponent } from '../components/page-note/page-note';
import { BatchHourPipe } from '../pipes/batch-hour/batch-hour';
import { AdmListProductsResellersInventoryComponent } from '../components/adm-list-products-resellers-inventory/adm-list-products-resellers-inventory';
import { ResellerAmountComponent } from '../components/reseller-amount/reseller-amount';
import { ProductFilterPipe } from '../pipes/product-filter/product-filter';
import { UserAddressRowComponent } from '../components/user-address-row/user-address-row';
import { HeaderScrollableDirective } from '../components/header-scrollable/header-scrollable';
import { LoadingComponent } from '../components/loading/loading';
import { CityFilterPipe } from '../pipes/city-filter/city-filter';
import { StateFilterPipe } from '../pipes/state-filter/state-filter';
import { StoreListComponent } from '../components/store-list/store-list';
import { DeliveryHourPipe } from '../pipes/delivery-hour/delivery-hour';
import { HeroBannerComponent } from '../components/hero-banner/hero-banner.component';
import { ShowTimeout } from './show-timeout';
import { SheetModalComponent } from '../components/sheet-modal/sheet-modal';
import { MyRequestsListComponent } from '../components/my-requests-list/my-requests-list';
import { MoneyPipe } from "../pipes/money/money";
import { DocumentPipe } from '../pipes/document/document';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment'; // Importar o MomentModule
import { DistrictFilterPipe } from '../pipes/district-filter/district-filter';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    PageMessageBox,
    LongPress,
    ShowTimeout,
    HeaderScrollableDirective,
    Header,
    ItemCartAmount,
    ReservationBar,
    ClientComingBar,
    BrandIconComponent,
    TipOnTap,
    ProductImg,
    ProductDetails,
    AdmProductAmountControl,
    AdmListProductsInventoryComponent,
    AdmListProductsResellersInventoryComponent,
    AdmListDispatchOrdersComponent,
    ProductCategoryFilterPipe,
    MoneyPipe,
    DocumentPipe,
    ProductFilterPipe,
    ProductInventoryDayFilterPipe,
    DispatchOrderFilterPipe,
    BatchHourPipe,
    DeliveryHourPipe,
    TransactionStatusPipe,
    AdmDispatchListItemComponent,
    PageNoteComponent,
    ResellerAmountComponent,
    UserAddressRowComponent,
    LoadingComponent,
    CityFilterPipe,
    StateFilterPipe,
    StoreListComponent,
    HeroBannerComponent,
    MyRequestsListComponent,
    SheetModalComponent,
    DistrictFilterPipe,
  ],
  exports: [ 
    MyRequestsListComponent,
    SheetModalComponent,
    PageMessageBox,
    LongPress,
    ShowTimeout,
    HeaderScrollableDirective,
    Header,
    ReservationBar,
    ClientComingBar,
    BrandIconComponent,
    ItemCartAmount,
    TipOnTap,
    ProductImg,
    ProductDetails,
    MomentModule,
    AdmProductAmountControl,
    AdmListProductsInventoryComponent,
    AdmListProductsResellersInventoryComponent,
    AdmListDispatchOrdersComponent,
    ProductCategoryFilterPipe,
    MoneyPipe,
    DocumentPipe,
    ProductFilterPipe,
    ProductInventoryDayFilterPipe,
    DispatchOrderFilterPipe,
    BatchHourPipe,
    DeliveryHourPipe,
    TransactionStatusPipe,
    AdmDispatchListItemComponent,
    PageNoteComponent,
    ResellerAmountComponent,
    UserAddressRowComponent,
    LoadingComponent,
    CityFilterPipe,
    StateFilterPipe,
    StoreListComponent,
    HeroBannerComponent,
    DistrictFilterPipe,
  ]
})
export class SharedModule {
}
