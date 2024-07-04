import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.state';
import { selectUserResetState } from '../store/auth/auth.selector';
import {  take } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const store = inject(Store<AuthState>);
  let result = false;

  store
    .select(selectUserResetState)
    .pipe(take(1))
    .subscribe((res) => {
      if (res.isReset) {
        result = true;
      }
    });

  if (!result) {
    router.navigate(['']);
  }
  
  return result;
};
