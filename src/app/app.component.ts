import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthModalComponent } from './core/components/auth-modal/auth-modal.component';
import { NavComponent } from './core/components/nav/nav.component';
import { AuthService } from './core/services/auth.service';

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
