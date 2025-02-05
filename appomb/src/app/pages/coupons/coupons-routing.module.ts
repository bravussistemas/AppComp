import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponsPage } from './coupons';
import { CouponsRegisterPage } from '../coupons-register/coupons-register';

const routes: Routes = [
  {
    path: '',
    component: CouponsPage,
  },
  {
    path: 'CouponsRegisterPage',
    component: CouponsRegisterPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
