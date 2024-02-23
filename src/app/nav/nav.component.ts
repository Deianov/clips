import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  private modalService = inject(ModalService);
  public authService = inject(AuthService);
  public isAuthenticated = false;

  constructor() {
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  openModal($event: Event) {
    $event.preventDefault();
    this.modalService.toggleModal('auth');
  }

  logout($event: Event) {
    $event.preventDefault();
    this.authService.logout();
  }
}
