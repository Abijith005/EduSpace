import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { environments } from 'src/environments/environments';
import { AuthService } from '../modules/auth/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  refresh: boolean = false;
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _ngToaster: NgToastService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const baseUrl = environments.apiUrl;
    let modifiedRequest = request.clone({
      url: baseUrl + request.url,
      withCredentials: true,
    });
    const token = localStorage.getItem('authToken');
    if (token) {
      modifiedRequest.headers.set('Authorization', token);
    }
    return next.handle(modifiedRequest).pipe(
      catchError((error: any) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !this.refresh
        ) {
          this.refresh = true;
          const refreshToken = localStorage.getItem('refreshToken');
          return this._authService.getNewAccessToken(refreshToken!).pipe(
            switchMap((res: any) => {
              if (res.success) {
                localStorage.setItem('accessToken', res.accessToken!);

                // Retry the original request with the new access token
                modifiedRequest = modifiedRequest.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`,
                  },
                });

                return next.handle(modifiedRequest);
              } else {
                // If obtaining a new access token fails, propagate the error
                return throwError(error);
              }
            })
          );
        }

        this.refresh = false;
        if (error instanceof HttpErrorResponse && error.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this._router.navigate(['']);

          this._ngToaster.error({
            position: 'topCenter',
            duration: 2000,
            detail: 'Unauthorized',
          });
        } else {
          this._ngToaster.error({
            position: 'topCenter',
            duration: 2000,
            detail: 'Internal server error',
          });
        }

        return throwError(error);
      })
    );
  }
}
