import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCreditCardPage } from './list-credit-card';
import { RegisterCreditCard } from '../register-credit-card/register-credit-card';

const routes: Routes = [
  {
    path: '',
    component: ListCreditCardPage,
  },
  {
    path: 'RegisterCreditCard',
    component: RegisterCreditCard,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListCreditCardRoutingModule { }
