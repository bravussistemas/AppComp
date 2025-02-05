import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseScheduleDeliveryDate } from './choose-schedule-delivery-date';

const routes: Routes = [
  {
    path: '',
    component: ChooseScheduleDeliveryDate,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseScheduleDeliveryDateRoutingModule { }
