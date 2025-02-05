import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUserSalesPage } from './list-user-sales';
import { HomePage } from '../home/home';

const routes: Routes = [
  {
    path: '',
    component: ListUserSalesPage,
  },
  {
    path: 'HomePage',
    component: HomePage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListUserSalesRoutingModule { }
