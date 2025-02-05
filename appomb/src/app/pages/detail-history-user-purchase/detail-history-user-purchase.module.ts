import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { DetailHistoryUserPurchasePage } from "./detail-history-user-purchase";
import { DetailHistoryUserPurchaseRoutingModule } from "./detail-history-user-purchase-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    DetailHistoryUserPurchasePage
  ],
  imports: [
    DetailHistoryUserPurchaseRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    DetailHistoryUserPurchasePage
  ]
})
export class ListHistoryUserPurchaseModule {
}
