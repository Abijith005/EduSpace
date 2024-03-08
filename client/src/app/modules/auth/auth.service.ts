import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IgenreralResponse,
  IuserLogin,
  IuserRegisterData,
} from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  userRegister(registerData: IuserRegisterData) {
    return this._http.post<IgenreralResponse>(
      `/v1/auth/user/register`,
      registerData
    );
  }

  userLogin(loginData: IuserLogin) {
    return this._http.post<IgenreralResponse>(
      `/v1/auth/${loginData.role}/login`,
      loginData
    );
  }

  getNewAccessToken(token:String){
    return this._http.get(`v1/auth/token/accessToken/${token}`)
  }
}
