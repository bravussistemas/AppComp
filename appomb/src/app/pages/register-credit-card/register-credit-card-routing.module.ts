import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterCreditCard } from './register-credit-card';
import { HomePage } from '../home/home';
import { CheckoutComplete } from '../checkout-complete/checkout-complete';

const routes: Routes = [
  {
    path: '',
    component: RegisterCreditCard,
  },
  {
    path: 'HomePage',
    component: HomePage,
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
export class RegisterCreditCardRoutingModule { }
