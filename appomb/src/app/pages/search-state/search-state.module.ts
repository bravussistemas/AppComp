import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchStatePage } from './search-state';
import { SharedModule } from '../../shared/shared.module';
import { SearchStateRoutingModule } from './search-state-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    SearchStatePage,
  ],
  imports: [
    SearchStateRoutingModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SearchStatePageModule {
}
