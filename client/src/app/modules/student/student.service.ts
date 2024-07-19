import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcategoryResponse } from '../../interfaces/categoryResponse';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { ICourseDetails } from '../../interfaces/courseDetails';
import { IFilterValues } from '../../interfaces/filterValues';
import { IfilterSelectionItems } from '../../interfaces/filterSelectionList';

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
    filter: IFilterValues
  ) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      filter: JSON.stringify(filter),
    }).toString();
    return this._http.get<
      IgenreralResponse & { courses: ICourseDetails[]; totalPages: number }
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
}
