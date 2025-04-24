import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignIn } from './sign-in';
import { SignUp } from '../sign-up/sign-up';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { HomePage } from '../home/home';

const routes: Routes = [
  {
    path: '',
    component: SignIn,
  },
  {
    path: 'SignUp',
    component: SignUp,
  },
  {
    path: 'ForgotPassword',
    component: ForgotPasswordPage,
  },
  {
    path: 'HomeList',
    component: HomePage,
  },
  
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignInRoutingModule { }
