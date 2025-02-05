import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SearchDistrictPage } from './search-district';
import { SearchDistrictRoutingModule } from './search-district-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    SearchDistrictPage,
  ],
  imports: [
    SearchDistrictRoutingModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SearchDistrictPageModule {
}
