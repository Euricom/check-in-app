import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscribedPageRoutingModule } from './subscribed-routing.module';

import { SubscribedPage } from './subscribed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscribedPageRoutingModule
  ],
  declarations: [SubscribedPage]
})
export class SubscribedPageModule {}
