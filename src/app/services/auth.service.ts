import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
import { delay, filter, from, map, Observable, of, switchMap } from 'rxjs';

import { computed, inject, Injectable, Signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	ChildActivationEnd,
	ChildActivationStart,
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	RouteConfigLoadEnd,
	RouteConfigLoadStart,
	Router,
	RoutesRecognized,
} from '@angular/router';

import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AngularFireAuth);
  private firestore = inject(AngularFirestore);
  private users: AngularFirestoreCollection<IUser>;
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  public isAuthenticatedSignal: Signal<Observable<boolean>> = computed(
    () => this.isAuthenticated$
  );

  public displayName$: Signal<Observable<string>> = computed(() =>
    this.auth.user.pipe(map((user) => user?.displayName || ''))
  );

  // time for the user to see a login's message
  private readonly AUTHENTICATION_DELAY = 1000;

  constructor() {
    this.users = this.firestore.collection('users');
    this.isAuthenticated$ = this.auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(this.AUTHENTICATION_DELAY)
    );

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.snapshot.firstChild),
        switchMap((route) => of(getRouteAuth(route)))
      )
      .subscribe((data) => {
        this.redirect = data.authOnly ?? false;
      });
  }

  public async createUser(model: IUser) {
    if (!model.password) {
      throw new Error('Password not provided!');
    }

    const userCredential = await this.auth.createUserWithEmailAndPassword(
      model.email,
      model.password
    );

    if (!userCredential.user) {
      throw new Error("User can't be found!");
    }

    // custom: Firebase/Authentication/Users/User UID
    await this.users.doc(userCredential.user.uid).set({
      name: model.name,
      email: model.email,
      age: model.age,
      phoneNumber: model.phoneNumber,
    });

    await userCredential.user.updateProfile({ displayName: model.name });
  }

  public async signIn(credentials: UserCredentials): Promise<string> {
    try {
      await this.auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      return '';
    } catch (e) {
      console.error(e);
      return 'An unexpected error occurred. Please try again later.';
    }
  }

  public async logout($event?: Event) {
    $event?.preventDefault();
    await this.auth.signOut();

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}

type UserCredentials = {
  email: string;
  password: string;
};

function getRouteAuth(route: ActivatedRouteSnapshot | null): {
  authOnly: boolean;
} {
  const data = Object.prototype.hasOwnProperty.call(route?.data, 'authOnly')
    ? route?.data
    : route?.firstChild?.data;

  return {
    authOnly: Boolean(typeof data === 'object' ? data['authOnly'] : false),
  };
}

/*
    https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#createuserwithemailandpassword

    this.auth
      .createUserWithEmailAndPassword(email as string, password as string)
      .catch(function (error) {
        if (error.code === 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(error.message);
        }
        console.log(error);
      })
      .then();

*/

/* generated UID

    await this.users.add({
      name: model.name,
      email: model.email,
      age: model.age,
      phoneNumber: model.phoneNumber,
    });
*/
