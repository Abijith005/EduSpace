import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcategoryData } from '../../interfaces/categoryData';
import { ICourseDetails } from '../../interfaces/courseDetails';

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

  getAllCourses(page: number, limit: number, search: string, filter: string) {
    return this._http.get<IgenreralResponse&{courses:ICourseDetails[]}>(
      `/v1/course/manageCourse/all?page=${page}&limit=${limit}&search=${search}&filter=${filter}&id=true`
    );
  }

  uploadCourse(data: FormData) {
    return this._http.post<IgenreralResponse>(
      `/v1/course/manageCourse/uploadCourse`,
      data
    );
  }
}
