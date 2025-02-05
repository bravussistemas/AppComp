import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseDeliveryEmployeePage } from './choose-delivery-employee';
import { SharedModule } from '../../shared/shared.module';
import { ChooseDeliveryAddressRoutingModule } from './choose-delivery-employee-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ChooseDeliveryEmployeePage,
  ],
  imports: [
    ChooseDeliveryAddressRoutingModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
  ],
})
export class ChooseDeliveryEmployeePageModule {
}
