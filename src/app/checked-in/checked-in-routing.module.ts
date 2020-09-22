import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckedInPage } from './checked-in.page';

const routes: Routes = [
  {
    path: '',
    component: CheckedInPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckedInPageRoutingModule {}
