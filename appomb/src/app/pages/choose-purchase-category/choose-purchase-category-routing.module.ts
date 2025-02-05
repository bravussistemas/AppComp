import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoosePurchaseCategory } from './choose-purchase-category';
import { AdmManageProductPage } from '../adm-manage-product/adm-manage-product';
import { UserRequestsHistoryPage } from '../user-requests-history/user-requests-history';
import { ChooseStore } from '../choose-store/choose-store';

const routes: Routes = [
  {
    path: '',
    component: ChoosePurchaseCategory,
  },
  {
    path: 'AdmManageProductPage',
    component: AdmManageProductPage,
  },
  {
    path: 'UserRequestsHistoryPage',
    component: UserRequestsHistoryPage,
  },
  {
    path: 'ChooseStore',
    component: ChooseStore,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChoosePurchaseCategoryRoutingModule { }
