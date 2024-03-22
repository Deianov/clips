import { DatePipe } from '@angular/common';
import { Component, computed, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FbTimestampPipe } from '../pipes/fb-timestamp.pipe';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clips-list',
  standalone: true,
  imports: [RouterLink, FbTimestampPipe],
  templateUrl: './clips-list.component.html',
  providers: [DatePipe],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  private readonly clipService = inject(ClipService);

  @Input() scrollable = true;

  // clips = computed(() => this.clipService.pageClips);
  clips = this.clipService.pageClips;

  constructor() {
    this.clipService.getClips();
  }

  ngOnInit(): void {
    if (this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }

    // to empty the array
    this.clipService.pageClips.length = 0;
  }

  /*
  offsetHeight - page
  innerHeight - viewable area in browser
  scrollTop - distance from top of innerHeight to top of page
  */
  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    // scroll to the bottom of the page
    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if (bottomOfWindow) {
      this.clipService.getClips();
    }
  };
}
