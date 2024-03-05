import { Observable, of, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const url: string = state.url;

    return this.authService.isAuthenticated$.pipe(
      switchMap((value) => {
        if (!value) {
          this.router.navigateByUrl('/');
        }
        return of(value);
      })
    );
  }
}
