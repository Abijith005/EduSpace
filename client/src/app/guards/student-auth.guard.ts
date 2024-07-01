import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../modules/auth/auth.service';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';

export const studentAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const store=inject(Store<AppState>)
  const result = authService.isLogin();
  if (result.login && result.role === 'student') {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
