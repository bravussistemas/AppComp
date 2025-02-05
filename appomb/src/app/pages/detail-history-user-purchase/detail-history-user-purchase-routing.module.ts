import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailHistoryUserPurchasePage } from './detail-history-user-purchase';

const routes: Routes = [
  {
    path: '',
    component: DetailHistoryUserPurchasePage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailHistoryUserPurchaseRoutingModule { }
