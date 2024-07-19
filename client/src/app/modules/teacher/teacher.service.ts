import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcategoryData } from '../../interfaces/categoryData';
import { ICourseDetails } from '../../interfaces/courseDetails';
import { IFilterValues } from '../../interfaces/filterValues';

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

  getAllowedCategories() {
    return this._http.get<IgenreralResponse & { categories: IcategoryData[] }>(
      `/v1/course/categories/allowed`
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

  getAllCourses(
    page: number,
    limit: number,
    search: string,
    filter: IFilterValues
  ) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      filter: JSON.stringify(filter),
      id: 'true',
    }).toString();
    return this._http.get<
      IgenreralResponse & { courses: ICourseDetails[]; totalPages: number }
    >(`/v1/course/manageCourse/all?${queryParams}`);
  }

  uploadCourse(data: FormData) {
    return this._http.post<IgenreralResponse>(
      `/v1/course/manageCourse/uploadCourse`,
      data
    );
  }

  updateCourse(data: FormData, course_id: string) {
    console.log(data);

    return this._http.put<IgenreralResponse>(
      `/v1/course/manageCourse/updateCourse/${course_id}`,
      data
    );
  }
}
