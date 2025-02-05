import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAddressSimplePage } from './add-address-simple';

const routes: Routes = [
  {
    path: '',
    component: AddAddressSimplePage
  },{
    path: 'add-address-simple',
    loadChildren: () => import('../add-address-simple/add-address-simple.module').then(m => m.AddAddressSimplePageModule)
  },
  {
    path: 'search-state',
    loadChildren: () => import('../search-state/search-state.module').then(m => m.SearchStatePageModule)
  },
  {
    path: 'search-city',
    loadChildren: () => import('../search-city/search-city.module').then(m => m.SearchCityPageModule)
  },
  {
    path: 'search-district',
    loadChildren: () => import('../search-district/search-district.module').then(m => m.SearchDistrictPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAddressSimpleRoutingModule {}
