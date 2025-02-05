import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { UserRequestsHistoryPage } from "./user-requests-history";
import { UserRequestsHistoryRoutingModule } from "./user-requests-history-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    UserRequestsHistoryPage
  ],
  imports: [
    UserRequestsHistoryRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    UserRequestsHistoryPage
  ]
})
export class UserRequestsHistoryPageModule {
}
