import { NgModule } from "@angular/core";
import { ForgotPasswordPage } from "./forgot-password";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { ForgotPasswordRoutingModule } from "./forgot-password-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    ForgotPasswordPage
  ],
  imports: [
    ForgotPasswordRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ForgotPasswordPage
  ]
})
export class ForgotPasswordModule {
}
