import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.state';
import { selectRouteInfo } from '../store/auth/auth.selector';
import { take } from 'rxjs';

export const adminModuleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AuthState>);
  const router = inject(Router);
  let result = false;
  store
    .select(selectRouteInfo)
    .pipe(take(1))
    .subscribe((res) => {
      if (res.isLoggedIn && res.userData.role === 'admin') {
        result = true;
        router.navigate(['auth']);
      }
    });

  return result;
};
