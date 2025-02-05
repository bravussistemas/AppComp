import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardErrorPopUp } from './card-error-pop-up';

const routes: Routes = [  
  {
    path: '',
    component: CardErrorPopUp, // Adicione o componente principal da página aqui
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardErrorPopUpRoutingModule { }
