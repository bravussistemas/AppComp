import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProductActivesPage } from './edit-product-actives';

const routes: Routes = [
  {
    path: '',
    component: EditProductActivesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProductActivesRoutingModule { }
