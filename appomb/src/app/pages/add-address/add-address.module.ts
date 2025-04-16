import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Import IonicModule for Ionic 8+
import { AddAddressPage } from './add-address';
import { SharedModule } from '../../shared/shared.module';
import { Swiper} from 'swiper';
import { AddAddressPageRoutingModule } from './add-address-routing.module';


@NgModule({
  declarations: [
    AddAddressPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule, // Use IonicModule instead of IonicPageModule
    SharedModule,
    AddAddressPageRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, // Adicione o schema aqui
  ],
})
export class AddAddressPageModule {}
