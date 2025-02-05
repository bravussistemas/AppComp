import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardErrorPopUp } from './card-error-pop-up';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { CardErrorPopUpRoutingModule } from './card-error-pop-up-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CardErrorPopUp,
  ],
  imports: [
    CardErrorPopUpRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
  ],
})
export class CardErrorPopUpModule {
}
