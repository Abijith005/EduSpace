// import { Injectable } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { AuthState } from '../../store/auth/auth.state';
// import { AuthService } from '../auth/auth.service';
// import { checkAuthStatusSuccess } from '../../store/auth/auth.actions';

// @Injectable({
//   providedIn: 'root',
// })
// export class AppInitService {
//   constructor(
//     private authService: AuthService,
//     private _store: Store<{ auth: AuthState }>
//   ) {}

//   initApp(): Promise<void> {
//     return new Promise((resolve) => {
//       this.authService.getUserInfo().subscribe((res) => {
//         this._store.dispatch(
//           checkAuthStatusSuccess({ userDatas: res.userInfo })
//         );
//       });
//       resolve();
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthState } from '../../store/auth/auth.state';
import { AuthService } from '../auth/auth.service';
import {
  checkAuthStatusFailure,
  checkAuthStatusSuccess,
} from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  constructor(
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService
  ) {}

  async initApp(): Promise<void> {
    const token = localStorage.getItem('refreshToken');
    await firstValueFrom(
      this.authService.getUserInfo(token).pipe(
        retry(3),
        map((response) => {
          if (response.success && response.userInfo) {
            this.store.dispatch(
              checkAuthStatusSuccess({ userDatas: response.userInfo })
            );
          } else {
            this.store.dispatch(checkAuthStatusFailure());
          }
        }),
        catchError(() => {
          return of(undefined);
        })
      )
    );
    return undefined;
  }
}
