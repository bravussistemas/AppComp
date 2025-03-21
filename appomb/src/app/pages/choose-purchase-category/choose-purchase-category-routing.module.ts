import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoosePurchaseCategory } from './choose-purchase-category';
import { AdmManageProductPage } from '../adm-manage-product/adm-manage-product';
import { UserRequestsHistoryPage } from '../user-requests-history/user-requests-history';
import { ChooseStore } from '../choose-store/choose-store';
import { ChooseStoreModule } from '../choose-store/choose-store.module';

const routes: Routes = [
  {
    path: '',
    component: ChoosePurchaseCategory,
  },
  {
    path: 'AdmManageProductPage',
    loadChildren: () => import('../adm-manage-product/adm-manage-product.module').then( m => m.AdmManageProductPageModule)
  },
  {
    path: 'UserRequestsHistoryPage',
    loadChildren: () => import('../user-requests-history/user-requests-history.module').then( m => m.UserRequestsHistoryPageModule)
  },
  {
    path: 'choose-store',
    redirectTo: 'ChooseStore',
    pathMatch: 'full'
  },
  {
    path: 'ChooseStore',
    //loadChildren: () => import('../choose-store/choose-store.module').then( m => m.ChooseStoreModule)
    component: ChooseStore,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChoosePurchaseCategoryRoutingModule { }
