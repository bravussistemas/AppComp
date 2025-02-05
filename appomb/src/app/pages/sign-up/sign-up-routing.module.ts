import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUp } from './sign-up';

const routes: Routes = [
  {
    path: '',
    component: SignUp,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
