import { NgModule } from '@angular/core';
import { ChooseDeliveryAddressPage } from './choose-delivery-address';
import { SharedModule } from '../../shared/shared.module';
import { ChooseDeliveryAddressRoutingModule } from './choose-delivery-address-routing.module';

@NgModule({
  declarations: [
    ChooseDeliveryAddressPage,
  ],
  imports: [
    ChooseDeliveryAddressRoutingModule,
    SharedModule,
  ],
})
export class ChooseDeliveryAddressPageModule {
}
