import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { EditProductActivesPage } from './edit-product-actives';
import { EditProductActivesRoutingModule } from './edit-product-actives-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    EditProductActivesPage,
  ],
  imports: [
    EditProductActivesRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    EditProductActivesPage
  ]
})
export class EditProductActivesModule {
}
