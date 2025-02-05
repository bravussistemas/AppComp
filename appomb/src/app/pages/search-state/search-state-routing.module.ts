import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchStatePage } from './search-state';

const routes: Routes = [
  {
    path: '',
    component: SearchStatePage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchStateRoutingModule { }
