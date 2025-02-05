import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddOperatingDayNotePage } from './add-operating-day-note';
import { AddOperatingDayNoteRoutingModule } from './add-operating-day-note-routing.module'; // Importa o módulo de roteamento
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    AddOperatingDayNotePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild(),
    AddOperatingDayNoteRoutingModule 
  ],
  exports: [
    AddOperatingDayNotePage
  ]
})
export class AddOperatingDayNotePageModule {}
