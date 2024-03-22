import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { Routes } from '@angular/router';
import { authGuard } from '@shared/guards/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/');

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,

    children: [
      { path: '', pathMatch: 'full', redirectTo: 'manage' },
      {
        path: 'manage',
        loadComponent: () =>
          import('./manage/manage.component').then((m) => m.ManageComponent),
        data: {
          authGuardPipe: redirectUnauthorizedToHome,
        },
        canActivate: [AngularFireAuthGuard],
      },
      {
        path: 'upload',
        loadComponent: () =>
          import('./upload/upload.component').then((m) => m.UploadComponent),
        canActivate: [authGuard],
      },
    ],
  },
];
