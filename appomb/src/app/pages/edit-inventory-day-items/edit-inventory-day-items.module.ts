import { NgModule } from '@angular/core';
import { EditInventoryDayItemsPage } from './edit-inventory-day-items';
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { EditInventoryDayItemsRoutingModule } from "./edit-inventory-day-items-routing.module";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    EditInventoryDayItemsPage,
  ],
  imports: [
    EditInventoryDayItemsRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    EditInventoryDayItemsPage
  ]
})
export class EditInventoryDayItemsPageModule {}
