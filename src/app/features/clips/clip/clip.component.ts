import videojs from 'video.js';

import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FbTimestampPipe } from '../../../shared/pipes/fb-timestamp.pipe';
import IClip from '../clip.model';
import { ClipsListComponent } from '../clips-list/clips-list.component';

import type Player from 'video.js/dist/types/player';
@Component({
  selector: 'app-clip',
  standalone: true,
  imports: [RouterLink, ClipsListComponent, FbTimestampPipe],
  providers: [DatePipe],
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ClipComponent implements OnInit {
  private route = inject(ActivatedRoute);
  clip?: IClip;

  /*
  Accessed with ngAfterInit
  static: true -> before ngOnInit
  */
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: Player;

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);

    this.route.data.subscribe((data) => {
      this.clip = data.clip as IClip;
      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4',
      });
    });
  }
}
