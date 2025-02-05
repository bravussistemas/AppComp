import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditDispatchFilterPage } from './edit-dispatch-filter';

const routes: Routes = [
  {
    path: '',
    component: EditDispatchFilterPage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditDispatchFilterRoutingModule { }
