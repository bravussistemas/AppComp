import { NgModule } from '@angular/core';
import { SearchAddressPage } from './search-address';
import { SharedModule } from '../../shared/shared.module';
import { SearchAddressRoutingModule } from './search-address-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    SearchAddressPage,
  ],
  imports: [
    SearchAddressRoutingModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SearchAddressPageModule {
}
