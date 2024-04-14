import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';

/*
  https://angular.io/api/forms/AsyncValidator
  https://firebase.google.com/docs/reference/js/auth#fetchsigninmethodsforemail

  https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection
  https://github.com/firebase/firebaseui-web/issues/1040


  To disable email enumeration protection, follow these steps:
  Firebase console

  In the Firebase console, go to the Firebase Auth Settings page.

    Go to Firebase Auth settings
        In the navigation pane, select User actions.
        Clear Email enumeration protection (recommended).
    Click Save.
*/

@Injectable({
  providedIn: 'root',
})
export class EmailTaken implements AsyncValidator {
  #auth = inject(AngularFireAuth);

  // todo: work with disabled: Email enumeration protection?
  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return this.#auth
      .fetchSignInMethodsForEmail(control.value)
      .then((response) => (response.length ? { emailTaken: true } : null));
  };
}

// return fetchSignInMethodsForEmail(getAuth(), control.value)...
