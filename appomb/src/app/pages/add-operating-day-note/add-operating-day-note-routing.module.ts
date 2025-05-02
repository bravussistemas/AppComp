import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOperatingDayNotePage } from './add-operating-day-note';

const routes: Routes = [
  {
    path: 'AddOperatingDayNotePage',
    component: AddOperatingDayNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddOperatingDayNoteRoutingModule { }
