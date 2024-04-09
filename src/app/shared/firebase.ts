//  https://github.com/angular/angularfire/issues/3365

import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  FirebaseOptions,
  initializeApp,
  provideFirebaseApp,
} from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const API_KEY = import.meta.env?.NG_APP_API_KEY;
console.log(API_KEY);

const firebaseEnvironments: FirebaseOptions = {
  apiKey: API_KEY,
  authDomain: 'clips-e1dca.firebaseapp.com',
  projectId: 'clips-e1dca',
  storageBucket: 'clips-e1dca.appspot.com',
  appId: '1:713352392676:web:10f1a3b8779934f272a1f1',
};

const firebaseProviders: EnvironmentProviders = importProvidersFrom([
  provideFirebaseApp(() => initializeApp(firebaseEnvironments)),
  provideFirestore(() => getFirestore()),
  provideAuth(() => getAuth()),
]);

export { firebaseProviders, firebaseEnvironments };
