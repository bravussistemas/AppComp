import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUserSalesPage } from '../list-user-sales/list-user-sales';
import { HomePage } from '../home/home';
import { SignUp } from '../sign-up/sign-up';
import { SignIn } from '../sign-in/sign-in';

const routes: Routes = [
  {
    path: '',
    component: ListUserSalesPage,
  },
  {
    path: 'HomePage',
    component: HomePage,
  },
  {
    path: 'SignIn',
    component: SignIn,
  },
  {
    path: 'SignUp',
    component: SignUp,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
