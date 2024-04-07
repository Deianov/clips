import { provideEnvironmentNgxMask } from 'ngx-mask';

import { ApplicationConfig } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { PreloadAllModules, provideRouter, TitleStrategy, withDebugTracing, withPreloading } from '@angular/router';
import { firebaseEnvironments, firebaseProviders } from '@shared/firebase';

import { TemplatePageTitleStrategy } from '../config/template-page-title-strategy';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
      // withDebugTracing()
    ),
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    provideEnvironmentNgxMask(),
    firebaseProviders,
    { provide: FIREBASE_OPTIONS, useValue: firebaseEnvironments },
  ],
};
