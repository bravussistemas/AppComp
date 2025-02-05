import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmDispatchOrderSalesPage } from './adm-dispatch-order-sales'; // Substitua pelo caminho correto

const routes: Routes = [
  {
    path: '',
    component: AdmDispatchOrderSalesPage, // O componente principal desta rota
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Configura o carregamento lazy
  exports: [RouterModule], // Exporta o módulo de rotas para o módulo pai
})
export class AdmDispatchOrderSalesRoutingModule {}
