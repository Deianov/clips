import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { AuthService } from './services/auth.service';
import { AuthModalComponent } from './user/auth-modal/auth-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent, AuthModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private authService = inject(AuthService);

  isAuthenticated: Signal<Observable<boolean>> = computed(
    () => this.authService.isAuthenticatedWithDelay$
  );
}
