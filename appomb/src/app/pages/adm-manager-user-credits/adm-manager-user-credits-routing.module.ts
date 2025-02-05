import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmManagerUserCreditsPageModule } from './adm-manager-user-credits.module';

const routes: Routes = [
  {
    path: '',
    component: AdmManagerUserCreditsPageModule, // Adicione o componente principal da página aqui
  },
  {
    path: 'adm-detail-user-credits',
    component: AdmManagerUserCreditsPageModule, // O componente que deve ser carregado
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmManagerUserCreditsRoutingModule {}
