import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRequestsHistoryPage } from './user-requests-history';
import { DetailHistoryUserPurchasePage } from '../detail-history-user-purchase/detail-history-user-purchase';

const routes: Routes = [
  {
    path: '',
    component: UserRequestsHistoryPage,
  },
  
  {
    path: 'DetailHistoryUserPurchasePage',
    component: DetailHistoryUserPurchasePage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRequestsHistoryRoutingModule { }
