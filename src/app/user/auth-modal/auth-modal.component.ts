import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ModalService } from '../../services/modal.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TabComponent } from '../../shared/tab/tab.component';
import { TabsContainerComponent } from '../../shared/tabs-container/tabs-container.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    TabComponent,
    TabsContainerComponent,
    ModalComponent,
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css',
})
export class AuthModalComponent implements OnInit, OnDestroy {
  modalService = inject(ModalService);

  ngOnInit(): void {
    this.modalService.register('auth');
  }
  ngOnDestroy(): void {
    this.modalService.unregister('auth');
  }
}
