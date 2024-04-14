import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  #modals: IModal[] = [];

  register(id: string) {
    this.#modals.push({ id, visible: false });
  }

  unregister(id: string) {
    this.#modals = this.#modals.filter((modal) => modal.id !== id);
  }

  isModalOpen(id: string): boolean {
    return !!this.#modals.find((modal) => modal.id === id)?.visible;
  }

  toggleModal(id: string, timeout?: number) {
    const modal = this.#modals.find((modal) => modal.id === id);
    if (modal) {
      setTimeout(() => {
        modal.visible = !modal.visible;
      }, timeout ?? 0);
    }
  }
}
