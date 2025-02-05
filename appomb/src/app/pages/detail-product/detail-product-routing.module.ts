import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailProduct } from './detail-product'

const routes: Routes = [
  {
    path: '',
    component: DetailProduct,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailProductRoutingModule { }
