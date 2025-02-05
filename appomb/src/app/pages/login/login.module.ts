import { NgModule } from "@angular/core";
import { LoginPage } from "./login";
import { LoginRoutingModule } from "./login-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    LoginRoutingModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    LoginPage
  ]
})
export class LoginModule {}
