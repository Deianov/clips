import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private elementRef = inject(ElementRef);

  @Input() modalID = '';

  ngOnInit(): void {
    // Protect the component from CSS inheritance
    document.body.appendChild(this.elementRef.nativeElement);
  }

  isModalOpen() {
    return this.modalService.isModalOpen(this.modalID);
  }

  closeModal() {
    this.modalService.toggleModal(this.modalID);
  }

  // remove the element from DOM
  ngOnDestroy(): void {
    document.body.removeChild(this.elementRef.nativeElement);
  }
}
