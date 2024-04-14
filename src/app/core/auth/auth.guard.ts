import { Inject, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuardService).canActivate(route, state);
};
