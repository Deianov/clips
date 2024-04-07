//  https://github.com/angular/angularfire/issues/3365

import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '@environments';

const firebaseEnvironments = environment.firebase;

if (environment.production) {
  firebaseEnvironments.apiKey = process?.env?.apiKey || '';
}

const firebaseProviders: EnvironmentProviders = importProvidersFrom([
  provideFirebaseApp(() => initializeApp(firebaseEnvironments)),
  provideFirestore(() => getFirestore()),
  provideAuth(() => getAuth()),
]);

export { firebaseProviders, firebaseEnvironments };
