import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home';
import { UserRequestsHistoryPage } from '../user-requests-history/user-requests-history';
import { ListHistoryUserPurchasePage } from '../list-history-user-purchase/list-history-user-purchase';
import { ChoosePurchaseCategory } from '../choose-purchase-category/choose-purchase-category';
import { FIRST_PAGE_APP } from '../../shared/constants';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'UserRequestsHistoryPage',
    component: UserRequestsHistoryPage,
  },
  {
    path: 'ListHistoryUserPurchasePage',
    component: ListHistoryUserPurchasePage,
  },
  {
    path: FIRST_PAGE_APP,
    component: ChoosePurchaseCategory,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
