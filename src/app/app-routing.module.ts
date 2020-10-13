import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

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
    canActivate: [AuthGuard],
  },
  {
    path: 'events/new',
    loadChildren: () =>
      import('./event-create/event-create.module').then(
        (m) => m.EventCreatePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'event/:id',
    loadChildren: () =>
      import('./event/event.module').then((m) => m.EventPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'access-denied',
    loadChildren: () =>
      import('./pages/access-denied/access-denied.module').then(
        (m) => m.AccessDeniedPageModule
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
