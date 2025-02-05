import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfilePage } from './user-profile';
import { EditPasswordPage } from '../edit-password/edit-password';
import { RegisterMobilePhone } from '../register-mobile-phone/register-mobile-phone';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage,
  },
  {
    path: 'EditPasswordPage',
    component: EditPasswordPage,
  },
  
  {
    path: '',
    component: RegisterMobilePhone,
  },
  
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
