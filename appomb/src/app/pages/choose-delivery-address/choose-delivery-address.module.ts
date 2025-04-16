import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ChooseDeliveryAddressPage } from './choose-delivery-address';
import { SharedModule } from '../../shared/shared.module';
import { ChooseDeliveryAddressRoutingModule } from './choose-delivery-address-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddAddressPageModule } from '../add-address/add-address.module';
import { SearchCityPageModule } from '../search-city/search-city.module';
import { AddAddressPage } from '../add-address/add-address';
import { AddAddressSimplePage } from '../add-address-simple/add-address-simple';
import { AddAddressSimplePageModule } from '../add-address-simple/add-address-simple.module';
import { SearchStatePageModule } from '../search-state/search-state.module';

@NgModule({
  declarations: [ChooseDeliveryAddressPage],
  imports: [
    ChooseDeliveryAddressRoutingModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    AddAddressPageModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, // Adicione o schema aqui
  ],
})
export class ChooseDeliveryAddressPageModule {}
