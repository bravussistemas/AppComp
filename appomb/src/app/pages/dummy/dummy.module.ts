import { NgModule } from '@angular/core';
import { DummyPage } from './dummy';
import { SharedModule } from '../../shared/shared.module';
import { DummyRoutingModule } from './dummy-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    DummyPage,
  ],
  imports: [
    DummyRoutingModule,
    SharedModule,
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class DummyPageModule {}
