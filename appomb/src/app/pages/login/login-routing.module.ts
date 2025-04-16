import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUserSalesPage } from '../list-user-sales/list-user-sales';
import { HomePage } from '../home/home';
import { SignUp } from '../sign-up/sign-up';
import { SignIn } from '../sign-in/sign-in';
import { LoginPage } from './login';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'ListUserSalesPage',
    loadChildren: () =>
      import('../../pages/list-user-sales/list-user-sales.module').then(
        (m) => m.ListUserSalesPageModule
      ),
  },
  {
    path: 'HomePage',
    loadChildren: () =>
      import('../../pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'SignIn',
    loadChildren: () =>
      import('../../pages/sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  {
    path: 'SignUp',
    loadChildren: () =>
      import('../../pages/sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
