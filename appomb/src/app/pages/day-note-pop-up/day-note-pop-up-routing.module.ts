import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayNotePopUpPage } from './day-note-pop-up';

const routes: Routes = [
  {
    path: '',
    component: DayNotePopUpPage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRegisterRoutingModule { }
