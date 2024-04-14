import { Routes } from '@angular/router';

import { ClipComponent } from './features/clips/clip/clip.component';
import { ClipResolver } from './features/clips/resolvers/clip-resolver';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', title: 'Home', component: HomeComponent },
  {
    path: 'about',
    title: 'About',
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/video/video-routes').then((m) => m.routes),
  },
  {
    path: 'clip/:id',
    component: ClipComponent,
    resolve: { clip: ClipResolver },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/components/page-errors/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
