import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../store/auth/auth.state';
import { Store } from '@ngrx/store';
import { selectUserLogin } from '../store/auth/auth.selector';
import { take } from 'rxjs';

export const authModuleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AuthState>);
  let result = true;
  store
    .select(selectUserLogin)
    .pipe(take(1))
    .subscribe((res) => {
      if (res.isLogin) {
        result = false;
      } else {
        localStorage.clear();
      }
    });

  return result;
};
