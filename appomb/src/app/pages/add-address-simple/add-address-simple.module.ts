import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddAddressSimplePage } from './add-address-simple';
import { AddAddressSimpleRoutingModule } from './add-address-simple-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AddAddressSimplePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    AddAddressSimpleRoutingModule, 
  ],
})
export class AddAddressSimplePageModule {}
