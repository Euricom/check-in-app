import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckedInPageRoutingModule } from './checked-in-routing.module';

import { CheckedInPage } from './checked-in.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckedInPageRoutingModule
  ],
  declarations: [CheckedInPage]
})
export class CheckedInPageModule {}
