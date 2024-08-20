import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcategoryData } from '../../interfaces/categoryData';
import { IcourseDetails } from '../../interfaces/courseDetails';
import { IfilterValues } from '../../interfaces/filterValues';
import { IwithdrawRequest } from '../../interfaces/withdrawRequests';
import { IpaymentDatas } from '../../interfaces/paymentData';

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
    filter: IfilterValues
  ) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      filter: JSON.stringify(filter),
      id: 'true',
    }).toString();
    return this._http.get<
      IgenreralResponse & { courses: IcourseDetails[]; totalPages: number }
    >(`/v1/course/manageCourse/all?${queryParams}`);
  }

  uploadCourse(data: FormData) {
    return this._http.post<IgenreralResponse>(
      `/v1/course/manageCourse/uploadCourse`,
      data
    );
  }

  updateCourse(data: FormData, course_id: string) {
    return this._http.put<IgenreralResponse>(
      `/v1/course/manageCourse/updateCourse/${course_id}`,
      data
    );
  }

  sentWithdrawalOtp(password: string) {
    return this._http.post<IgenreralResponse>(
      '/v1/teacher/withdrawal/sentOTP',
      { password }
    );
  }

  withdrawalRequest(data: {
    accountNumber: string;
    ifsc: string;
    amount: string;
    otp: string;
    accountHolder: string;
  }) {
    return this._http.post<IgenreralResponse>(
      '/v1/teacher/withdrawal/request',
      data
    );
  }
  updateWithdrawalRequest(data: {
    accountNumber: string;
    ifsc: string;
    amount: string;
    otp: string;
    accountHolder: string;
    requestId: string;
  }) {
    return this._http.put<IgenreralResponse>(
      '/v1/teacher/withdrawal/request',
      data
    );
  }

  userWithdrawalData(
    filter: string,
    startDate: string,
    endDate: string,
    currentPage: number,
    limit: number
  ) {
    return this._http.get<
      IgenreralResponse & { totalPages: number; data: IwithdrawRequest[] }
    >(
      `/v1/payment/withdrawal/userRequests?filter=${filter}&currentPage=${currentPage}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  getWalletBalance(userId: string) {
    return this._http.get<IgenreralResponse & { walletBalance: number }>(
      `/v1/payment/wallet/balance/${userId}`
    );
  }

  getAllPayments(
    search: string,
    filter: string,
    startDate: string,
    endDate: string,
    currentPage: number,
    limit: number
  ) {
    return this._http.get<
      IgenreralResponse & { data: IpaymentDatas[]; totalPages: number }
    >(
      `/v1/payment/paymentManage/all?search=${search}&filter=${filter}&currentPage=${currentPage}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
    );
  }
}
