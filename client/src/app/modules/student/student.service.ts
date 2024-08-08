import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcategoryResponse } from '../../interfaces/categoryResponse';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcourseDetails } from '../../interfaces/courseDetails';
import { IfilterValues } from '../../interfaces/filterValues';
import { IfilterSelectionItems } from '../../interfaces/filterSelectionList';
import { IsubscriptionData } from '../../interfaces/subscriptionData';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private _http: HttpClient) {}

  getAllCategories() {
    return this._http.get<
      IgenreralResponse & { categories: IcategoryResponse[] }
    >(`/v1/course/categories/all`);
  }

  getAllCourses(
    page: number,
    limit: number,
    search: string,
    filter: IfilterValues
  ) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      filter: JSON.stringify(filter),
    }).toString();
    return this._http.get<
      IgenreralResponse & { courses: IcourseDetails[]; totalPages: number }
    >(`/v1/course/manageCourse/all?${queryParams}`);
  }

  getAllFilterDatas() {
    return this._http.get<
      IgenreralResponse & {
        data: {
          priceRange: { minPrice: number; maxPrice: number };
          categoryData: IfilterSelectionItems[];
          instructorData: IfilterSelectionItems[];
          ratingData: IfilterSelectionItems[];
        };
      }
    >('/v1/course/manageCourse/filterDatas');
  }

  getAllIntructorsCourseCount() {
    return this._http.get<
      IgenreralResponse & {
        data: { _id: string; name: string; count: number }[];
      }
    >(`/v1/course/manageCourse/courseCount/teacher`);
  }

  getAllRatingCount() {
    return this._http.get<
      IgenreralResponse & { data: { rating: number; count: number }[] }
    >(`/v1/course/manageCourse/courseCount/rating`);
  }

  getCourseDetails(course_id: string) {
    return this._http.get<
      IgenreralResponse & { courseDetails: IcourseDetails }
    >(`/v1/course/manageCourse/courseDetails/${course_id}`);
  }

  getAllSubscriptions() {
    return this._http.get<IgenreralResponse & { courses: IsubscriptionData[] }>(
      `/v1/course/manageCourse/subscriptions/all`
    );
  }

  updateUserInfo(data: FormData) {
    return this._http.put<IgenreralResponse>(
      '/v1/student/studentManage/profile',
      data
    );
  }
}
