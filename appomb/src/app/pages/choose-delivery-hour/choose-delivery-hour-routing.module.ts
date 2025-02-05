import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseDeliveryHourPage } from './choose-delivery-hour';
import { CheckoutComplete } from '../checkout-complete/checkout-complete';

const routes: Routes = [
  {
    path: '',
    component: ChooseDeliveryHourPage,
  },
  {
    path: 'CheckoutComplete',
    component: CheckoutComplete,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseDeliveryHourRoutingModule { }
