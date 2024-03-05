import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import IUser from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { InputComponent } from '../../shared/input/input.component';
import { EmailTaken } from '../validators/email-taken';
import { RegisterValidators } from '../validators/register-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, InputComponent, AlertComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private emailTaken = inject(EmailTaken);
  private fb = inject(FormBuilder);

  inSubmission = false;

  fg = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: this.emailTaken.validate,
        },
      ],
      age: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(100),
      ]),
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
          ),
        ],
      ],
      confirm_password: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
        ],
      ],
    },
    {
      validators: [
        RegisterValidators.passwordEasy,
        RegisterValidators.match('password', 'confirm_password'),
      ],
    }
  );

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created.';
  alertColor = 'blue';

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.authService.createUser(this.fg.value as IUser);
    } catch (e) {
      this.inSubmission = false;
      console.error(e);
      this.alertMsg = 'An unexpected error occurred. Please try again later.';
      this.alertColor = 'red';
      return;
    }

    this.alertMsg = 'Success! Your account has been created.';
    this.alertColor = 'green';
  }
}
