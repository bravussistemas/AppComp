// src/app/pages/list-breads/list-breads.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AboutRoutingModule } from './about-routing.module';
import { AboutPage } from './about';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutRoutingModule, 
    TranslateModule.forChild(),   
    SharedModule,                 
  ],
})
export class AboutPageModule {}
