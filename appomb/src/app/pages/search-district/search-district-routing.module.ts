import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchDistrictPage } from './search-district';

const routes: Routes = [
  {
    path: '',
    component: SearchDistrictPage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchDistrictRoutingModule { }
