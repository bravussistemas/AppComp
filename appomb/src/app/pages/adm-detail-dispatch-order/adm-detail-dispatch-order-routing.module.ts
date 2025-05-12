import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmDetailDispatchOrderPage } from './adm-detail-dispatch-order';

const routes: Routes = [
  {
    path: ':id',
    component: AdmDetailDispatchOrderPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmDetailDispatchOrderRoutingModule {}
