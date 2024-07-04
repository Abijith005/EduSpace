import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { StoreModule } from '@ngrx/store';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { userAuthReducer } from './store/auth/auth.reducers';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environments } from '../environments/environments';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { EffectsModule } from '@ngrx/effects';
import { AppInitializerService } from './modules/shared/app-init.service';
import { SharedModule } from './modules/shared/shared.module';
import { sharedReducer } from './store/shared/shared.reducer';


export function initializeApp(appInitService: AppInitializerService) {
  return (): Promise<void> => appInitService.initApp();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    StoreModule.forRoot({userAuth:userAuthReducer},{}),
    StoreModule.forFeature('sharedDatas',sharedReducer),
    SocialLoginModule,
    FontAwesomeModule,
    FontAwesomeModule,
    SharedModule

    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environments.clientId,
              {
                oneTapEnabled:false,
                prompt:'consent'
              }
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitializerService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
