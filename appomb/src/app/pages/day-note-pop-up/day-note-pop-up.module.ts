import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayNotePopUpPage } from './day-note-pop-up';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { CouponsRegisterRoutingModule } from './day-note-pop-up-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    DayNotePopUpPage,
  ],
  imports: [
    CouponsRegisterRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class DayNotePopUpPageModule {
}
