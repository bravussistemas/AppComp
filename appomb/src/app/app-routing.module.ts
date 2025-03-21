import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChooseStore } from './pages/choose-store/choose-store';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'ChoosePurchaseCategory',
    loadChildren: () => import('./pages/choose-purchase-category/choose-purchase-category.module').then( m => m.ChoosePurchaseCategoryModule)
  },
  {
    path: 'ChooseStore',
    loadChildren: () => import('./pages/choose-store/choose-store.module').then( m => m.ChooseStoreModule)
    //component: ChooseStore,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
