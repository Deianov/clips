import { BehaviorSubject } from 'rxjs';

import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink, RouterOutlet } from '@angular/router';

import IClip from '../../models/clip.model';
import { ClipService } from '../../services/clip.service';
import { ModalService } from '../../services/modal.service';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [RouterOutlet, RouterLink, EditComponent],
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly clipService = inject(ClipService);
  private readonly modal = inject(ModalService);

  videoOrder = 1;
  clips: IClip[] = [];
  activeClip = signal<IClip | null>(null);

  sort$: BehaviorSubject<string>;

  constructor() {
    this.sort$ = new BehaviorSubject(String(this.videoOrder));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? 2 : 1;
      this.sort$.next(String(this.videoOrder));
    });
    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = [];

      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  // todo: the select component change navigation's active status ?
  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();
    this.activeClip.set(clip);

    this.modal.toggleModal(EditComponent.MODAL_ID);
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();
    this.activeClip.set(null);

    this.clipService.deleteClip(clip);
    this.clips.forEach((element, index) => {
      if (element.docID === clip.docID) {
        this.clips.splice(index, 1);
      }
    });
  }

  setClip($event: IClip) {
    this.activeClip.set($event);
  }

  // update($event: IClip){
  //   this.clips.forEach((element, index) => {
  //     if(element.docID === $event.docID) {
  //       this.clips[index].title = $event.title
  //     }
  //   })
  // }
}
