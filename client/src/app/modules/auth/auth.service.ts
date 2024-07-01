import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IuserLogin } from '../../interfaces/userLogin';
import { AppState } from '../../store/app.state';
import {
  selectUserAuthState,
  selectUserResetState,
} from '../../store/userAuthSelector';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IuserRegisterData } from '../../interfaces/userRegisterData';
import { IuserInformation } from '../../interfaces/userInformation';
import { ItokenData } from '../../interfaces/tokenInterface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, private _store: Store<AppState>) {}
  number = 1;
  userRegister(registerData: IuserRegisterData) {
    return this._http.post<IgenreralResponse>(
      `/v1/auth/user/register`,
      registerData
    );
  }

  sendOtp(email: string, role: string) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/sendOtp`, {
      email,
      role,
    });
  }

  userLogin(loginData: IuserLogin) {
    return this._http.post<
      IgenreralResponse & { userinfo: IuserInformation } & ItokenData
    >(`/v1/auth/user/login`, loginData);
  }

  getNewAccessToken(token: String) {
    return this._http.get<IgenreralResponse & { accessToken: string }>(
      `/v1/auth/token/accessToken/${token}`
    );
  }

  forgotPassword(email: string, role: string) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/forgotPassword`, {
      email,
      role,
    });
  }

  verifyOtp(email: string, role: string, otp: string) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/verifyOtp`, {
      email,
      otp,
      role,
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

  isLogin() {
    let login;
    let role;
    this._store.select(selectUserAuthState).subscribe((res) => {
      login = res.isLoggedIn;
      role = res.userData.role;
    });
    return { login, role };
  }

  signInWithGoogle(data: IuserInformation) {
    return this._http.post<
      ItokenData & IgenreralResponse & { userInfo: IuserInformation }
    >(`/v1/auth/socialAuth/login`, data);
  }
}
