import { PopOverListComponent } from './../components/pop-over-list/pop-over-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventPageRoutingModule } from './event-routing.module';

import { EventPage } from './event.page';
import { FilterPipe } from '../shared/pipes/filter.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, EventPageRoutingModule],
  declarations: [EventPage, FilterPipe, PopOverListComponent],
})
export class EventPageModule {}
