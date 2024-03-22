import { filter, Observable, take } from 'rxjs';

import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import IClip from '../models/clip.model';
import { ClipService } from '../services/clip.service';

export const ClipResolver: ResolveFn<IClip | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  clipService: ClipService = inject(ClipService)
): Observable<IClip | null> =>
  clipService.resolve(route.params.id).pipe(
    filter((clip) => !!clip),
    take(1)
  );
