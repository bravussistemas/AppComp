import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBreadsPage } from './list-breads';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ListBreadsRoutingModule } from './list-breads-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ListBreadsPage,
  ],
  imports: [
    ListBreadsRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ListBreadsPageModule {
}
