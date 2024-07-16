import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcategoryResponse } from '../../interfaces/categoryResponse';
import { IgenreralResponse } from '../../interfaces/generalResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private _http:HttpClient) { }


  getAllCategories(){
    return this._http.get<IgenreralResponse& {categories:IcategoryResponse[]}>(`/v1/course/categories/all`)
  }
}
