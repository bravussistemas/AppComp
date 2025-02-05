import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importar FormsModule
import { EditDispatchFilterPage } from './edit-dispatch-filter';
import { EditDispatchFilterRoutingModule } from './edit-dispatch-filter-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    EditDispatchFilterPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule, // Use IonicModule instead of IonicPageModule
    SharedModule,
  ],
  exports: [
    EditDispatchFilterPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, // Adicione o schema aqui
  ],
})
export class EditDispatchFilterPageModule {}