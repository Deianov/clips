import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { Routes } from '@angular/router';
import { authGuard } from '@shared/guards/auth.guard';

import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { HomeComponent } from './home/home.component';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/');

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', title: 'Home', component: HomeComponent },
  {
    path: 'about',
    title: 'About',
    component: AboutComponent,
  },
  {
    path: 'manage',
    loadChildren: () =>
      import('./video/video-routes').then((m) => m.MANAGE_ROUTES),
    data: {
      authGuardPipe: redirectUnauthorizedToHome,
    },
    canActivate: [AngularFireAuthGuard],
  },
  {
    path: 'upload',
    loadChildren: () =>
      import('./video/video-routes').then((m) => m.UPLOAD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'clip/:id',
    component: ClipComponent,
  },
  {
    path: '**',
    loadComponent: () =>
      import('./errors/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
