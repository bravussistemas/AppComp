import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDispatchDeliveryPage } from './list-dispatch-delivery';
import { HomePage } from '../home/home';

const routes: Routes = [
  {
    path: '',
    component: ListDispatchDeliveryPage,
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
export class ListDispatchDeliveryRoutingModule { }
