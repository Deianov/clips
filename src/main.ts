import 'firebase/compat/auth';

import firebase from 'firebase/compat/app';

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '@environments';
import { firebaseEnvironments } from '@shared/firebase';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
}

// Initializing Firebase First
firebase.initializeApp(firebaseEnvironments);
let isAppInit = false;

firebase.auth().onAuthStateChanged(() => {
  if (!isAppInit) {
    bootstrapApplication(AppComponent, appConfig).catch((err) =>
      console.error(err)
    );
    isAppInit = true;
  }
});
