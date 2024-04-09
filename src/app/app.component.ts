import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { AuthService } from './services/auth.service';
import { AuthModalComponent } from './user/auth-modal/auth-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, NavComponent, AuthModalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private authService = inject(AuthService);

  isAuthenticated = this.authService.isAuthenticatedSignal;
}
