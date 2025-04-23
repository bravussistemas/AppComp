import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchAddressPage } from './search-address';
import { HomePage } from '../home/home';

const routes: Routes = [
  {
    path: '',
    component: SearchAddressPage,
  },
  {
    path: 'HomeList',
    component: HomePage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchAddressRoutingModule { }
