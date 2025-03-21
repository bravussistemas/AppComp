import { NgModule } from '@angular/core';
import { ChooseDeliveryAddressPage } from './choose-delivery-address';
import { SharedModule } from '../../shared/shared.module';
import { ChooseDeliveryAddressRoutingModule } from './choose-delivery-address-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ChooseDeliveryAddressPage,
  ],
  imports: [
    ChooseDeliveryAddressRoutingModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
  ],
})
export class ChooseDeliveryAddressPageModule {
}
