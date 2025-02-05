import { NgModule } from '@angular/core';
import { UserProfilePage } from './user-profile';
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
    UserProfileRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    UserProfilePage
  ]
})
export class UserProfilePageModule {}
