import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  private modalService = inject(ModalService);
  private authService = inject(AuthService);

  displayName = this.authService.displayName$;
  isAuthenticated = this.authService.isAuthenticatedSignal;

  openModal($event: Event) {
    $event.preventDefault();
    this.modalService.toggleModal('auth');
  }

  logout = (event: Event) => {
    this.authService.logout(event);
  };
}
