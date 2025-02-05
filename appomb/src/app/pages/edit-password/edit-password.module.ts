import { SharedModule } from "../../shared/shared.module";
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditPasswordPage } from './edit-password';
import { TranslateModule } from "@ngx-translate/core";
import { EditPasswordRoutingModule } from "./edit-password-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    EditPasswordPage,
  ],
  imports: [
    EditPasswordRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    EditPasswordPage
  ]
})
export class EditPasswordPageModule {}
