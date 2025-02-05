import { NgModule } from "@angular/core";
import { SignUp } from "./sign-up";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { SignUpRoutingModule } from "./sign-up-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    SignUp
  ],
  imports: [
    SignUpRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    SignUp
  ]
})
export class SignUpModule {
}
