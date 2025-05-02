import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdmManagerUserCreditsPage } from './adm-manager-user-credits';
import { AdmDetailUserCreditsPage } from '../adm-detail-user-credits/adm-detail-user-credits';

const routes: Routes = [
  {
    path: 'AdmManagerUserCreditsPage',
    component: AdmManagerUserCreditsPage, // Adicione o componente principal da página aqui
  },
  {
    path: 'adm-detail-user-credits',
    component: AdmDetailUserCreditsPage, // O componente que deve ser carregado
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmManagerUserCreditsRoutingModule {}
