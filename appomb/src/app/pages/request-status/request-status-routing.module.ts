import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestStatusPage } from './request-status';

const routes: Routes = [
  {
    path: '',
    component: RequestStatusPage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestStatusRoutingModule { }
