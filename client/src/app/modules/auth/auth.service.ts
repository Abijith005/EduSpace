import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  IgenreralResponse,
  IuserInformation,
  IuserLogin,
  IuserRegisterData,
} from 'src/app/interfaces/interfaces';
import { AppState } from 'src/app/store/app.state';
import {
  selectUserAuth,
  selectUserResetState,
} from 'src/app/store/userAuthSelector';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, private _store: Store<AppState>) {}

  userRegister(registerData: IuserRegisterData) {
    return this._http.post<IgenreralResponse>(
      `/v1/auth/user/register`,
      registerData
    );
  }

  sendOtp(email: string) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/sendOtp`, {
      email: email,
    });
  }

  userLogin(loginData: IuserLogin) {
    return this._http.post<
      { accessToken: string; refreshToken: string } & IgenreralResponse
    >(`/v1/auth/${loginData.role}/login`, loginData);
  }

  getNewAccessToken(token: String) {
    return this._http.get<IgenreralResponse & { accessToken: string }>(
      `/v1/auth/token/accessToken/${token}`
    );
  }

  forgotPassword(email: string) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/forgotPassword`, {
      email: email,
    });
  }

  verifyOtp(email: string, otp: string) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/verifyOtp`, {
      email,
      otp,
    });
  }

  updatePassword(data: { email: string; password: string }) {
    return this._http.patch<IgenreralResponse>(
      `/v1/auth/user/updatePassword`,
      data
    );
  }

  isResetPassword() {
    let state;
    this._store.select(selectUserResetState).subscribe((res) => {

      state = res.isReset;
    });

    return state;
  }


  signInWithGoogle(data:IuserInformation){
    return this._http.post<
    { accessToken: string; refreshToken: string } & IgenreralResponse
  >(`/v1/auth/socialAuth/login`,data)
  }

  
  

}
