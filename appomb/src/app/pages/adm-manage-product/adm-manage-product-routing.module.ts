import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmManageProductPage } from './adm-manage-product'; // Certifique-se de que o caminho está correto

const routes: Routes = [
  {
    path: 'AdmManageProductPage',
    component: AdmManageProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmManageProductPageRoutingModule {}
