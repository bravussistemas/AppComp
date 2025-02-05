import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBreadsPage } from './list-breads';
import { DetailProduct } from '../detail-product/detail-product';

const routes: Routes = [
  {
    path: '',
    component: ListBreadsPage,
  },
  {
    path: 'DetailProduct',
    component: DetailProduct,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListBreadsRoutingModule { }
