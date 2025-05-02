import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmDetailUserCreditsPage } from './adm-detail-user-credits';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { AdmDetailUserCreditsRoutingModule } from './adm-detail-user-credits-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Configuração das rotas

@NgModule({
  declarations: [AdmDetailUserCreditsPage],
  imports: [
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    AdmDetailUserCreditsRoutingModule,
  ],
})
export class AdmDetailUserCreditsPageModule {}
