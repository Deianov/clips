import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '@shared/alert/alert.component';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  #authService = inject(AuthService);

  readonly credentials = {
    email: '',
    password: '',
  };

  // todo: change
  readonly email_regexp: RegExp = /^[a-z0-9._\-]+@[a-z0-9._\-]+$/;
  readonly password_regexp: RegExp =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  showAlert = false;
  alertMsg = '';
  alertColor = 'blue';
  inSubmission = false;

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    const resultMsg = await this.#authService.signIn(this.credentials);

    if (resultMsg !== '') {
      this.inSubmission = false;
      this.alertMsg = resultMsg;
      this.alertColor = 'red';
      return;
    }

    this.alertMsg = 'Success! You are now logged in.';
    this.alertColor = 'green';
  }
}
