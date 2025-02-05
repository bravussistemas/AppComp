import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseDeliveryAddressPage } from './choose-delivery-address';

const routes: Routes = [
  {
    path: '',
    component: ChooseDeliveryAddressPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseDeliveryAddressRoutingModule { }
