import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { AdmManagerUserCreditsPage } from './adm-manager-user-credits';
import { AdmManagerUserCreditsRoutingModule } from './adm-manager-user-credits-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AdmManagerUserCreditsPage,
  ],
  imports: [
    AdmManagerUserCreditsRoutingModule, // Importa o Routing Module separado
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
  ],
})
export class AdmManagerUserCreditsPageModule {}
