import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterDocumentNote } from './register-document-note';
import { HomePage } from '../home/home';

const routes: Routes = [
  {
    path: '',
    component: RegisterDocumentNote,
  },
  {
    path: 'HomePage',
    component: HomePage,
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterDocumentNoteRoutingModule { }
