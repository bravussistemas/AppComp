import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestStatusPage } from './request-status';
import { RequestStatusRoutingModule } from './request-status-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    RequestStatusPage,
  ],
  imports: [
    RequestStatusRoutingModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class RequestStatusPageModule {
}
