import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { RegisterMobilePhone } from "./register-mobile-phone";
import { SharedModule } from "../../shared/shared.module";
import { RegisterMobilePhoneRoutingModule } from "./register-mobile-phone-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    RegisterMobilePhone,
  ],
  imports: [
    RegisterMobilePhoneRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    RegisterMobilePhone
  ]
})
export class RegisterMobilePhoneModule {
}
