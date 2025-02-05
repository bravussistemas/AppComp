import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoosePurchaseCategory } from './choose-purchase-category';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChoosePurchaseCategoryRoutingModule } from './choose-purchase-category-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ChoosePurchaseCategory
  ],
  imports: [
    ChoosePurchaseCategoryRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
  ],
  exports: [
    ChoosePurchaseCategory
  ]
})
export class ChoosePurchaseCategoryModule {
}
