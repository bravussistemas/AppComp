import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseDeliveryEmployeePage } from './choose-delivery-employee';

const routes: Routes = [
  {
    path: '',
    component: ChooseDeliveryEmployeePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseDeliveryAddressRoutingModule { }
