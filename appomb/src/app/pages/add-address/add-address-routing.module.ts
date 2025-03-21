import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAddressPage } from './add-address';

const routes: Routes = [
  {
    path: '',
    component: AddAddressPage
  },
  // other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
