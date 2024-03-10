import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '@shared/alert/alert.component';
import { InputComponent } from '@shared/input/input.component';
import { ModalComponent } from '@shared/modal/modal.component';

import IClip from '../../models/clip.model';
import { ClipService } from '../../services/clip.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    AlertComponent,
    ModalComponent,
    ReactiveFormsModule,
    InputComponent,
    NgClass,
  ],
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  private readonly modal = inject(ModalService);
  private readonly clipService = inject(ClipService);
  static readonly MODAL_ID = 'editClip';

  activeClip = input<IClip | null>(null);

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Pleas wait! Updating clip.';
  inSubmission = false;

  @Output() update = new EventEmitter<IClip>();

  clipID = new FormControl('', {
    nonNullable: true,
  });

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  ngOnInit(): void {
    this.modal.register(EditComponent.MODAL_ID);
  }

  ngOnChanges(): void {
    const clip = this.activeClip();

    if (clip === null) {
      return;
    }

    this.clipID.setValue(clip.docID ?? '');
    this.title.setValue(clip.title);
    this.inSubmission = false;
    this.showAlert = false;
  }

  ngOnDestroy(): void {
    this.modal.unregister(EditComponent.MODAL_ID);
  }

  async submit() {
    const clip = this.activeClip();

    if (!clip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Pleas wait! Updating clip.';

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later';
      return;
    }

    clip.title = this.title.value;
    this.update.emit(clip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';

    this.modal.toggleModal(EditComponent.MODAL_ID, 1000);
  }
}
