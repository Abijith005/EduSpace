import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcategoryData } from '../../interfaces/categoryData';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcategoryResponse } from '../../interfaces/categoryResponse';
import {
  ICategoryRequest,
  ICertificate,
} from '../../interfaces/categoryRequest';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private _http: HttpClient) {}

  getAllCategories(page: number, limit: number) {
    return this._http.get<
      IgenreralResponse & {
        categories: IcategoryResponse[];
        totalPages: number;
      }
    >(`/v1/course/categories/all?page=${page}&limit=${limit}`);
  }

  addCategory(data: IcategoryData) {
    return this._http.post<IgenreralResponse>(
      '/v1/course/categories/create',
      data
    );
  }

  getAllRequests(page: number, limit: number) {
    return this._http.get<
      IgenreralResponse & { requests: ICategoryRequest[]; totalPages: number }
    >(`/v1/teacher/profile/requests/all?currentPage=${page}&limit=${limit}`);
  }

  updateCertificateStatus(data: {
    certificates: ICertificate[];
    requestId: string;
  }) {
    return this._http.put<IgenreralResponse>(
      `/v1/teacher/profile/requests/updateCertificates`,
      data
    );
  }

  updateRequest(data: { requestId: string; status: string }) {
    return this._http.put<IgenreralResponse>(
      `/v1/teacher/profile/requests/updateRequestStatus`,
      data
    );
  }

  updateCategoryStatus(data:{categoryId:string,status:boolean}){
    return this._http.patch<IgenreralResponse>(`/v1/course/categories/updateStatus`,data)
  }
}
