import { NgModule } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { AdmDispatchOrderSalesPage } from "./adm-dispatch-order-sales";
import { AdmDispatchOrderSalesRoutingModule } from "./adm-dispatch-order-sales-routing.module"; // Importa as rotas separadas
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AdmDispatchOrderSalesPage, // Declara o componente principal do módulo
  ],
  imports: [
    AdmDispatchOrderSalesRoutingModule, // Importa o módulo de rotas
    TranslateModule.forChild(),
    IonicModule,
    FormsModule,
    CommonModule,
    SharedModule, // Módulos compartilhados
  ],
})
export class AdmDispatchOrderSalesPageModule {}
