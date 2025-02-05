import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmDetailUserCreditsPage } from './adm-detail-user-credits'; // Certifique-se de que o caminho está correto

const routes: Routes = [
  {
    path: ':userId',
    component: AdmDetailUserCreditsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmDetailUserCreditsRoutingModule {}
