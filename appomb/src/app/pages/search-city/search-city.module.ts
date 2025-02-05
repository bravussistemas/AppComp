import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchCityPage } from './search-city';
import { SharedModule } from '../../shared/shared.module';
import { SearchCityRoutingModule } from './search-city-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    SearchCityPage,
  ],
  imports: [
    SearchCityRoutingModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SearchCityPageModule {
}
