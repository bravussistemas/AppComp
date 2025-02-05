import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBalanceStorePage } from './admin-balance-store';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AdminBalanceStoreRoutingModule } from './admin-balance-store-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AdminBalanceStorePage,
  ],
  imports: [
    AdminBalanceStoreRoutingModule, // Importa o Routing Module separado
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class AdminBalanceStorePageModule {
}
