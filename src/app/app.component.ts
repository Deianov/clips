import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth/auth.service';
import { AuthModalComponent } from './core/auth/components/auth-modal/auth-modal.component';
import { NavComponent } from './core/components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, NavComponent, AuthModalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  #authService = inject(AuthService);

  isAuthenticated = this.#authService.isAuthenticatedSignal;
}
