import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponsPage } from './coupons';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CouponsRoutingModule } from './coupons-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CouponsPage,
  ],
  imports: [
    CouponsRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
  ],
})
export class CuponsPageModule {
}
