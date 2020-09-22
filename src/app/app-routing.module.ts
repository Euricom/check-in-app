import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.module').then((m) => m.EventsPageModule),
  },
  {
    path: 'checked-in',
    loadChildren: () =>
      import('./checked-in/checked-in.module').then(
        (m) => m.CheckedInPageModule,
      ),
  },
  {
    path: 'subscribed',
    loadChildren: () =>
      import('./subscribed/subscribed.module').then(
        (m) => m.SubscribedPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
