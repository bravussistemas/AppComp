import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { ListHistoryUserPurchasePage } from "./list-history-user-purchase";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    ListHistoryUserPurchasePage
  ],
  imports: [
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ListHistoryUserPurchasePage
  ]
})
export class ListHistoryUserPurchaseModule {
}
