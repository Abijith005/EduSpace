import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, finalize, switchMap, throwError } from 'rxjs';
import { AuthService } from '../modules/auth/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Store } from '@ngrx/store';
import { SharedState } from '../store/shared/shared.state';
import { setLoading } from '../store/shared/shared.actions';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  private refresh: boolean = false;
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _ngToaster: NgToastService,
    private _store: Store<SharedState>
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let isAuthRoute = request.url.includes('auth');
    const isOpenAIRoute = request.url.includes('openAI');
    let loading: any;
    if (!isOpenAIRoute) {
      loading = setTimeout(() => {
        this._store.dispatch(setLoading({ isLoading: true }));
      }, 300);
    }
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !this.refresh &&
          !isAuthRoute
        ) {
          this.refresh = true;
          const refreshToken = localStorage.getItem('refreshToken');
          return this._authService.getNewAccessToken(refreshToken!).pipe(
            switchMap((res) => {
              if (res.success) {
                this.refresh = false;
                localStorage.setItem('accessToken', res.accessToken);
                request = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`,
                  },
                });
                return next.handle(request);
              } else {
                return throwError(() => new Error(res.message));
              }
            })
          );
        }

        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !isAuthRoute
        ) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this._router.navigate(['']);
        }

        this.refresh = false;
        this._ngToaster.error({
          position: 'topCenter',
          duration: 2000,
          detail: error.error.message,
        });
        return throwError(error);
      }),
      finalize(() => {
        clearTimeout(loading);
        this._store.dispatch(setLoading({ isLoading: false }));
      })
    );
  }
}
