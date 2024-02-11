import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ilogin } from 'src/app/interfaces/Ilogin';


@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {

  constructor(private _http:HttpClient) {
  }
  login(loginData:Ilogin){
    return this._http.post<i_>
  }
}
