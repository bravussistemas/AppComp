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
    loadChildren: () => import('../adm-manage-product/adm-manage-product.module').then( m => m.AdmManageProductPageModule)
  },
  {
    path: 'ListDispatchDeliveryPage',
    loadChildren: () => import('../list-dispatch-delivery/list-dispatch-delivery.module').then( m => m.ListDispatchDeliveryPageModule),
  },
  {
    path: 'ChooseDeliveryAddressPage',
    loadChildren: () => import('../choose-delivery-address/choose-delivery-address.module').then( m => m.ChooseDeliveryAddressPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseStoreRoutingModule { }
