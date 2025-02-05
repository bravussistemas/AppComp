import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListHistoryUserPurchasePage } from './list-history-user-purchase';
import { DetailHistoryUserPurchasePage } from '../detail-history-user-purchase/detail-history-user-purchase';

const routes: Routes = [
  {
    path: '',
    component: ListHistoryUserPurchasePage,
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
export class ListHistoryUserPurchaseRoutingModule { }
