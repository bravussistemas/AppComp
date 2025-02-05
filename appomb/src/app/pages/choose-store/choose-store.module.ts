import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseStore } from './choose-store';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChooseStoreRoutingModule } from './choose-store-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ChooseStore
  ],
  imports: [
    ChooseStoreRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
  ],
  exports: [
    ChooseStore
  ]
})
export class ChooseStoreModule {
}
