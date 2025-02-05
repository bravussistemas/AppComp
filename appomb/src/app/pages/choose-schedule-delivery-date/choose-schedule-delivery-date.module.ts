import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ChooseScheduleDeliveryDate } from "./choose-schedule-delivery-date";
import { SharedModule } from "../../shared/shared.module";
import { ChooseScheduleDeliveryDateRoutingModule } from "./choose-schedule-delivery-date-routing.module";
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ChooseScheduleDeliveryDate,
  ],
  imports: [
    ChooseScheduleDeliveryDateRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ChooseScheduleDeliveryDate
  ]
})
export class ChooseScheduleDeliveryDateModule {
}
