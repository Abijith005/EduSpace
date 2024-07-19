
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
