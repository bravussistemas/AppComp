import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { HomePage } from "./home";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { HomeRoutingModule } from "./home-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    HomeRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    HomePage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {
}