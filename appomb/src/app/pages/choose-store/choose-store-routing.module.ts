import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseStore } from './choose-store';
import { HomePage } from '../home/home';
import { AdmManageProductPage } from '../adm-manage-product/adm-manage-product';
import { ListDispatchDeliveryPage } from '../list-dispatch-delivery/list-dispatch-delivery';
import { ChooseDeliveryAddressPage } from '../choose-delivery-address/choose-delivery-address';

const routes: Routes = [
  {
    path: '',
    component: ChooseStore,
  },
  {
    path: 'HomePage',
    component: HomePage,
  },
  {
    path: 'AdmManageProductPage',
    component: AdmManageProductPage,
  },
  {
    path: 'ListDispatchDeliveryPage',
    component: ListDispatchDeliveryPage,
  },
  {
    path: 'ChooseDeliveryAddressPage',
    component: ChooseDeliveryAddressPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseStoreRoutingModule { }
