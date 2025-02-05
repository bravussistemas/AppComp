import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchCityPage } from './search-city';

const routes: Routes = [
  {
    path: '',
    component: SearchCityPage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCityRoutingModule { }
