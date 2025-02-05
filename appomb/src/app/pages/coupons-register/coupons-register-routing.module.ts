import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponsRegisterPage } from './coupons-register';

const routes: Routes = [
  {
    path: '',
    component: CouponsRegisterPage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRegisterRoutingModule { }
