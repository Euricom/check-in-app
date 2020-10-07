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
    path: 'events/new',
    loadChildren: () =>
      import('./event-create/event-create.module').then(
        (m) => m.EventCreatePageModule
      ),
  },
  {
    path: 'event/:id',
    loadChildren: () =>
      import('./event/event.module').then((m) => m.EventPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
