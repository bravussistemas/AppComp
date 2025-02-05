import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DummyPage } from './dummy';

const routes: Routes = [
  {
    path: '',
    component: DummyPage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DummyRoutingModule { }
