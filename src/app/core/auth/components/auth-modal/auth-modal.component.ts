import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TabComponent } from '../../../../shared/components/tab/tab.component';
import { TabsContainerComponent } from '../../../../shared/components/tabs-container/tabs-container.component';
import { ModalService } from '../../../services/modal.service';
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
})
export class AuthModalComponent implements OnInit, OnDestroy {
  #modalService = inject(ModalService);

  ngOnInit(): void {
    this.#modalService.register('auth');
  }
  ngOnDestroy(): void {
    this.#modalService.unregister('auth');
  }
}
