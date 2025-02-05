import { NgModule } from "@angular/core";
import { ListCreditCardPage } from "./list-credit-card";
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { ListCreditCardRoutingModule } from "./list-credit-card-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    ListCreditCardPage
  ],
  imports: [
    ListCreditCardRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ListCreditCardPage
  ]
})
export class ListCreditCardPageModule {
}
