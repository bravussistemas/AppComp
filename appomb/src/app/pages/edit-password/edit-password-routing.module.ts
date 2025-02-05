import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditPasswordPage } from './edit-password';
import { HomePage } from '../home/home';

const routes: Routes = [
  {
    path: '',
    component: EditPasswordPage,
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
export class EditPasswordRoutingModule { }
