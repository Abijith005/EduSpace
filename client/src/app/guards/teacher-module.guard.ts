import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.state';
import { selectRouteInfo } from '../store/auth/auth.selector';
import { take } from 'rxjs';

export const teacherModuleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store<AuthState>);
  let result = false;
  store
    .select(selectRouteInfo)
    .pipe(take(1))
    .subscribe((res) => {
      if (res.isLoggedIn && res.userData.role === 'teacher') {
        result = true;
      }
    });

  if (!result) {
    router.navigate(['auth']);
  }
  return result;
};
