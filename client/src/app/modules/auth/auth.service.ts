import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IuserLogin } from '../../interfaces/userLogin';
import { AuthState } from '../../store/auth/auth.state';
import {
  selectUserAuthState,
  selectUserResetState,
} from '../../store/auth/auth.selector';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IuserRegisterData } from '../../interfaces/userRegisterData';
import { IuserInformation } from '../../interfaces/userInformation';
import { ItokenData } from '../../interfaces/tokenInterface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, private _store: Store<AuthState>) {}
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
      IgenreralResponse & { userInfo: IuserInformation } & ItokenData
    >(`/v1/auth/user/login`, loginData);
  }

  getNewAccessToken(token: String) {
    return this._http.get<IgenreralResponse & { accessToken: string }>(
      `/v1/auth/token/accessToken/${token}`
    );
  }

  forgotPassword(email: string) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/forgotPassword`, {
      email,
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

  resetPassword(data: { email: string; password: string }) {
    return this._http.patch<IgenreralResponse>(
      `/v1/auth/user/resetPassword`,
      data
    );
  }

  getUserInfo(token: string | null) {
    if (!token) {
      return of({ success: false } as {
        success: boolean;
        userInfo?: IuserInformation;
      } & IgenreralResponse);
    }
    return this._http.get<{ userInfo: IuserInformation } & IgenreralResponse>(
      `/v1/auth/token/userInfo/${token}`
    );
  }

  signInWithGoogle(data: Omit<IuserInformation, 'role'>) {
    return this._http.post<
      ItokenData & IgenreralResponse & { userInfo: IuserInformation }
    >(`/v1/auth/socialAuth/login`, data);
  }

  signUpWithGoogle(data: IuserInformation) {
    return this._http.post<
      ItokenData & IgenreralResponse & { userInfo: IuserInformation }
    >(`/v1/auth/socialAuth/register`, data);
  }
}
