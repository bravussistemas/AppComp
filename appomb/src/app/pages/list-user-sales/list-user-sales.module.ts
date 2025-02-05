import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { ListUserSalesPage } from "./list-user-sales";
import { ListUserSalesRoutingModule } from "./list-user-sales-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    ListUserSalesPage
  ],
  imports: [
    ListUserSalesRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ListUserSalesPage
  ]
})
export class ListUserSalesPageModule {
}
