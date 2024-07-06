import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcategoryData } from '../../interfaces/categoryData';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcategoryResponse } from '../../interfaces/categoryResponse';
import { ICategoryRequest } from '../../interfaces/categoryRequest';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private _http: HttpClient) {}

  getAllCategories(page: number, limit: number) {
    return this._http.get<
      IgenreralResponse & { data: IcategoryResponse[]; totalPages: number }
    >(`/v1/admin/categories/all?page=${page}&limit=${limit}`);
  }

  addCategory(data: IcategoryData) {
    return this._http.post<IgenreralResponse>('/v1/admin/categories/add', data);
  }

  getAllRequests(page: number, limit: number) {
    return this._http.get<IgenreralResponse&{requests:ICategoryRequest[],totalPages:number}>(
      `/v1/admin/requests/all?currentPage=${page}&limit=${limit}`
    );
  }
}
