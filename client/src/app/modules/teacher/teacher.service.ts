import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcategoryData } from '../../interfaces/categoryData';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private _http: HttpClient) {}

  getAllCategories() {
    return this._http.get<IgenreralResponse & { categories: IcategoryData[] }>(
      `/v1/course/categories/all`
    );
  }

  uploadCertificates(data: { category: string; certificates: File[] }) {
    const uploadData = new FormData();
    uploadData.append('category', data.category);

    for (let i = 0; i < data.certificates.length; i++) {
      uploadData.append('certificates', data.certificates[i]);
    }

    return this._http.post<IgenreralResponse>(
      `/v1/teacher/profile/upload/certificates`,
      uploadData
    );
  }
}
