import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DetailProduct } from "./detail-product";
import { ParallaxHeader } from "../../components/parallax-header/parallax-header";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { DetailProductRoutingModule } from "./detail-product-routing.module";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    DetailProduct,
    ParallaxHeader
  ],
  imports: [
    DetailProductRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    DetailProduct
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Adicione isso
})
export class DetailProductModule {
}