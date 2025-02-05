import { NgModule } from '@angular/core';
import { ChooseDeliveryHourPage } from './choose-delivery-hour';
import { SharedModule } from '../../shared/shared.module';
import { ChooseDeliveryHourRoutingModule } from './choose-delivery-hour-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ChooseDeliveryHourPage,
  ],
  imports: [
    ChooseDeliveryHourRoutingModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
  ],
})
export class ChooseDeliveryHourPageModule {
}
