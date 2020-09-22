import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscribedPage } from './subscribed.page';

const routes: Routes = [
  {
    path: '',
    component: SubscribedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscribedPageRoutingModule {}
