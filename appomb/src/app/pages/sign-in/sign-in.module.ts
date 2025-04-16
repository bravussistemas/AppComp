import { NgModule } from "@angular/core";
import { SignIn } from "./sign-in";
import { TranslateModule } from "@ngx-translate/core";
import { SignInRoutingModule } from "./sign-in-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    SignIn,
  ],
  imports: [
    SignInRoutingModule,
    TranslateModule.forChild(),
    IonicModule,
    FormsModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    SignIn
  ]
})
export class SignInModule {
}
