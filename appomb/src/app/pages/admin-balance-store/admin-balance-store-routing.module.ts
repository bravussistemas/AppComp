import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBalanceStorePage } from './admin-balance-store';

const routes: Routes = [
  {
    path: 'AdminBalanceStorePage',
    component: AdminBalanceStorePage, // Adicione o componente principal da página aqui
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminBalanceStoreRoutingModule { }
