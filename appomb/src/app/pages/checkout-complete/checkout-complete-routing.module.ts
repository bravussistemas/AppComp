import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComplete } from './checkout-complete';
import { HomePage } from '../home/home';
import { ChoosePurchaseCategory } from '../choose-purchase-category/choose-purchase-category';
import { FIRST_PAGE_APP } from 'src/app/shared/constants';
import { ChooseScheduleDeliveryDate } from '../choose-schedule-delivery-date/choose-schedule-delivery-date';
import { ListCreditCardPage } from '../list-credit-card/list-credit-card';
import { RegisterCreditCard } from '../register-credit-card/register-credit-card';
import { RegisterDocumentNote } from '../register-document-note/register-document-note';
import { CouponsPage } from '../coupons/coupons';
import { CouponsRegisterPage } from '../coupons-register/coupons-register';
import { ChooseDeliveryAddressPage } from '../choose-delivery-address/choose-delivery-address';
import { ChooseDeliveryHourPage } from '../choose-delivery-hour/choose-delivery-hour';


const routes: Routes = [  
  {
    path: '',
    component: CheckoutComplete,
  },
  { 
    path: 'home', 
    component: HomePage 
  },
  {
    path: FIRST_PAGE_APP,
    component: ChoosePurchaseCategory,
  },
  {
    path: 'choose-schedule-delivery-date',
    component: ChooseScheduleDeliveryDate, // Substitua pelo componente correto
  },
  {
    path: 'RegisterDocumentNote',
    component: RegisterDocumentNote,
  },
  {
    path: 'ListCreditCardPage',
    component: ListCreditCardPage,
  },
  {
    path: 'RegisterCreditCard',
    component: RegisterCreditCard, // Substitua pelo componente correto
  },
  {
    path: 'CouponsPage',
    component: CouponsPage, // Substitua pelo componente correto
  },
  {
    path: 'CouponsRegisterPage',
    component: CouponsRegisterPage, // Substitua pelo componente correto
  },
  {
    path: 'ChooseDeliveryAddressPage',
    component: ChooseDeliveryAddressPage, // Substitua pelo componente correto
  },
  {
    path: 'ChooseDeliveryHourPage',
    component: ChooseDeliveryHourPage, // Substitua pelo componente correto
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutCompleteRoutingModule { }
