import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  IgenreralResponse,
  IuserInformation,
  IuserLogin,
  IuserRegisterData,
} from '../../interfaces/interfaces';
import { AppState } from '../../store/app.state';
import { selectUserResetState } from '../../store/userAuthSelector';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, private _store: Store<AppState>) {}
number=1
  userRegister(registerData: IuserRegisterData) {
    return this._http.post<IgenreralResponse>(
      `/v1/auth/user/register`,
      registerData
    );
  }

  sendOtp(email: string,role:string) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/sendOtp`, {
      email,role
    });
  }

  userLogin(loginData: IuserLogin) {
    return this._http.post<
      { accessToken: string; refreshToken: string } & IgenreralResponse
    >(`/v1/auth/user/login`, loginData);
  }

  getNewAccessToken(token: String) {
    return this._http.get<IgenreralResponse & { accessToken: string }>(
      `/v1/auth/token/accessToken/${token}`
    );
  }

  forgotPassword(email: string,role:string) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/forgotPassword`, {email,role});
  }

  verifyOtp(email: string, role:string,otp: string,) {
    return this._http.post<IgenreralResponse>(`/v1/auth/user/verifyOtp`, {
      email,
      otp,
      role
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
    console.log('its called '+this.number++);
    
    return this._http.post<
    { accessToken: string; refreshToken: string } & IgenreralResponse
  >(`/v1/auth/socialAuth/login`,data)
  }

  
  

}
