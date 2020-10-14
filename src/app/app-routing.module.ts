import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AdminGuard } from './shared/guards/admin.guard';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
    canActivate: [MsalGuard],
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.module').then((m) => m.EventsPageModule),
    canActivate: [MsalGuard],
  },
  {
    path: 'events/new',
    loadChildren: () =>
      import('./event-create/event-create.module').then(
        (m) => m.EventCreatePageModule
      ),
    canActivate: [AdminGuard, MsalGuard],
  },
  {
    path: 'event/:id',
    loadChildren: () =>
      import('./event/event.module').then((m) => m.EventPageModule),
    canActivate: [MsalGuard],
  },
  {
    path: 'access-denied',
    loadChildren: () =>
      import('./pages/access-denied/access-denied.module').then(
        (m) => m.AccessDeniedPageModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(
        (m) => m.NotFoundPageModule
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
