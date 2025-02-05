import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RegisterCreditCard } from "./register-credit-card";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { RegisterCreditCardRoutingModule } from "./register-credit-card-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    RegisterCreditCard,
  ],
  imports: [
    RegisterCreditCardRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    RegisterCreditCard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterCreditCardModule {
}
