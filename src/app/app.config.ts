import { provideEnvironmentNgxMask } from 'ngx-mask';

import { ApplicationConfig } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import {
  PreloadAllModules,
  provideRouter,
  TitleStrategy,
  withDebugTracing,
  withPreloading,
} from '@angular/router';
import { environment } from '@environments';

import { routes } from './app.routes';
import { firebaseProviders } from './config/firebase';
import { TemplatePageTitleStrategy } from './config/template-page-title-strategy';

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
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
};
