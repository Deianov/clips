import { Routes } from '@angular/router';

import { ClipComponent } from './clip/clip.component';
import { HomeComponent } from './home/home.component';
import { ClipResolver } from './resolvers/clip-resolver';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', title: 'Home', component: HomeComponent },
  {
    path: 'about',
    title: 'About',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./video/video-routes').then((m) => m.routes),
  },
  {
    path: 'clip/:id',
    component: ClipComponent,
    resolve: { clip: ClipResolver },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./errors/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
