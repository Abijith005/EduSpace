import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcategoryResponse } from '../../interfaces/categoryResponse';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcourseDetails } from '../../interfaces/courseDetails';
import { IfilterValues } from '../../interfaces/filterValues';
import { IfilterSelectionItems } from '../../interfaces/filterSelectionList';
import { IsubscriptionData } from '../../interfaces/subscriptionData';
import { Ireview } from '../../interfaces/reviews';

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

  getCourseDetails(courseId: string) {
    return this._http.get<
      IgenreralResponse & { courseDetails: IcourseDetails }
    >(`/v1/course/manageCourse/courseDetails/${courseId}`);
  }

  isSubscribed(courseId: string) {
    return this._http.get<IgenreralResponse & { subscribed: boolean }>(
      `/v1/course/subscriptions/isSubscribed/${courseId}`
    );
  }

  getAllSubscriptions(
    search: string,
    filter: string | null,
    page: number,
    limit: number
  ) {
    return this._http.get<
      IgenreralResponse & { courses: IsubscriptionData[]; totalPages: number }
    >(
      `/v1/course/subscriptions/all?search=${search}&filter=${filter}&page=${page}&limit=${limit}`
    );
  }

  updateUserInfo(data: FormData) {
    return this._http.put<
      IgenreralResponse & { profilePic: { key: string; url: string } }
    >('/v1/student/studentManage/profile', data);
  }

  updatePassword(oldPassword: string, password: string, email: string) {
    return this._http.patch<IgenreralResponse>(`/v1/auth/user/updatePassword`, {
      oldPassword,
      password,
      email,
    });
  }

  reviewCourse(courseId: string, rating: number, feedback: string) {
    return this._http.post<IgenreralResponse>('/v1/course/reviews/add', {
      courseId,
      rating,
      feedback,
    });
  }

  getReviews(courseId: string, page: number, limit: number) {
    return this._http.get<IgenreralResponse & { reviews: Ireview[] }>(
      `/v1/course/reviews/all?courseId=${courseId}&page=${page}&limit=${limit}`
    );
  }

  getFeaturedCourses() {
    return this._http.get<
      IgenreralResponse & {
        courseDetails: IcourseDetails[];
        totalCount: number;
      }
    >(`/v1/course/manageCourse/featured`);
  }

  getStatus() {
    return this._http.get<
      IgenreralResponse & { students: number; teachers: number }
    >(`/v1/student/status/applicationStatus`);
  }
}
