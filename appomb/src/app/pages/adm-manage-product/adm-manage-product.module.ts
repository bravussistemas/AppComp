import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmManageProductPage } from './adm-manage-product';
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { AdmManageProductPageRoutingModule } from './adm-manage-product-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AdmManageProductPage,
  ],
  imports: [
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    AdmManageProductPageRoutingModule
  ],
  exports: [
    AdmManageProductPage
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AdmManageProductPageModule {}
