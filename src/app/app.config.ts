import { provideEnvironmentNgxMask } from 'ngx-mask';

import { ApplicationConfig } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideRouter } from '@angular/router';
import { environment } from '@environments';
import { firebaseProviders } from '@shared/firebase';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideEnvironmentNgxMask(),
    firebaseProviders,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
};
