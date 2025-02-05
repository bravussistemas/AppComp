import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponsRegisterPage } from './coupons-register';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CouponsRegisterRoutingModule } from './coupons-register-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CouponsRegisterPage,
  ],
  imports: [
    CouponsRegisterRoutingModule,
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
