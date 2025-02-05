import { NgModule } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { AdmDetailDispatchOrderPage } from "./adm-detail-dispatch-order";
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Import IonicModule for Ionic 8+
import { AdmDetailDispatchOrderRoutingModule } from './adm-detail-dispatch-order-routing.module';

@NgModule({
  declarations: [
    AdmDetailDispatchOrderPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    AdmDetailDispatchOrderRoutingModule, // Importa o módulo de roteamento
    TranslateModule.forChild(),
    SharedModule
  ]
})
export class AdmDetailDispatchOrderPageModule {}
