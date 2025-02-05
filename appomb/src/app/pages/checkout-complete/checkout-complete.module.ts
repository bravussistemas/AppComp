import { NgModule } from "@angular/core";
import { CheckoutComplete } from "./checkout-complete";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../shared/shared.module";
import { CheckoutCompleteRoutingModule } from "./checkout-complete-routing.module";
import { provideHttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CheckoutComplete
  ],
  imports: [
    CheckoutCompleteRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
  ],
  exports: [
    CheckoutComplete
  ],
  providers: [
    provideHttpClient(),
  ],
})
export class CheckoutCompleteModule {
}
