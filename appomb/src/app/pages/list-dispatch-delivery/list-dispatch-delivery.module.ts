import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDispatchDeliveryPage } from './list-dispatch-delivery';
import { SharedModule } from '../../shared/shared.module';
import { ListDispatchDeliveryRoutingModule } from './list-dispatch-delivery-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ListDispatchDeliveryPage,
  ],
  imports: [
    ListDispatchDeliveryRoutingModule,
    TranslateModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ListDispatchDeliveryPageModule {
}
