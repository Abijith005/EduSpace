import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('interceptorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    
    const baseUrl=environments.apiUrl
    let modifiedRequest = request.clone({
      url:baseUrl+request.url,
      withCredentials:true
    });
    const token = localStorage.getItem('authToken');
    if (token) {
      modifiedRequest.headers.set('Authorization', token);
    }
    return next.handle(modifiedRequest);
  }
}
