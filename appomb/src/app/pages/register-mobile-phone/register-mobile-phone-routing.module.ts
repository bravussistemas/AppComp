import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterMobilePhone } from './register-mobile-phone';

const routes: Routes = [
  {
    path: 'RegisterMobilePhone',
    component: RegisterMobilePhone,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterMobilePhoneRoutingModule { }
