import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcategoryData } from '../../interfaces/categoryData';
import { IgenreralResponse } from '../../interfaces/generalResponse';
import { IcategoryResponse } from '../../interfaces/categoryResponse';
import {
  IcategoryRequest,
  Icertificate,
} from '../../interfaces/categoryRequest';
import { IinstructorDetails } from '../../interfaces/instructorDetails';
import { IstudentDetails } from '../../interfaces/studentDetails';
import { IwithdrawRequest } from '../../interfaces/withdrawRequests';
import { IpaymentDatas } from '../../interfaces/paymentData';

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

  getAllRequests(search: string, filter: string, page: number, limit: number) {
    return this._http.get<
      IgenreralResponse & { requests: IcategoryRequest[]; totalPages: number }
    >(
      `/v1/teacher/profile/requests/all?search=${search}&filter=${filter}&page=${page}&limit=${limit}`
    );
  }

  updateCertificateStatus(data: {
    certificates: Icertificate[];
    requestId: string;
  }) {
    return this._http.put<IgenreralResponse>(
      `/v1/teacher/profile/requests/updateCertificates`,
      data
    );
  }

  updateRequest(data: {
    requestId: string;
    status: string;
    category: string;
    user_id: string;
  }) {
    return this._http.put<IgenreralResponse>(
      `/v1/teacher/profile/requests/updateRequestStatus`,
      data
    );
  }

  updateCategoryStatus(data: { categoryId: string; status: boolean }) {
    return this._http.patch<IgenreralResponse>(
      `/v1/course/categories/updateStatus`,
      data
    );
  }

  getAllInstructors(
    search: string,
    filter: boolean | null,
    page: number,
    limit: number
  ) {
    return this._http.get<
      IgenreralResponse & {
        instructorDetails: IinstructorDetails[];
        totalPages: number;
      }
    >(
      `/v1/teacher/teacherManage/all?search=${search}&filter=${filter}&page=${page}&limit=${limit}`
    );
  }

  getAllStudents(
    search: string,
    filter: boolean | null = null,
    page: number,
    limit: number
  ) {
    return this._http.get<
      IgenreralResponse & {
        studentsDetails: IstudentDetails[];
        totalPages: number;
      }
    >(
      `/v1/student/studentManage/all?search=${search}&filter=${filter}&page=${page}&limit=${limit}`
    );
  }

  removeApprovedCategory(categoryIds: string[], userId: string) {
    return this._http.patch<IgenreralResponse>(
      `/v1/teacher/profile/removeApprovedCategory`,
      { categoryIds, userId }
    );
  }

  updateInstructorStatus(userId: string, status: boolean) {
    return this._http.patch<IgenreralResponse>(
      `/v1/teacher/teacherManage/status`,
      {
        userId,
        status,
      }
    );
  }

  updateStudentStatus(userId: string, status: boolean) {
    return this._http.patch<IgenreralResponse>(
      `/v1/student/studentManage/status`,
      {
        userId,
        status,
      }
    );
  }

  getWithdrawalRequests(
    search: string,
    filter: string,
    startDate: string,
    endDate: string,
    page: number,
    limit: number
  ) {
    return this._http.get<
      IgenreralResponse & { data: IwithdrawRequest[]; totalPages: number }
    >(
      `/v1/payment/withdrawal/withdrawRequests?search=${search}&filter=${filter}&page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  getWalletBalance(userId: string) {
    return this._http.get<IgenreralResponse & { walletBalance: number }>(
      `/v1/payment/wallet/balance/${userId}`
    );
  }

  approveWithdraw(data: {
    accountHolderName: string;
    accountNumber: number;
    amount: number;
    ifsc: string;
    requestId: string;
    userId: string;
  }) {
    return this._http.post<IgenreralResponse>(
      '/v1/payment/wallet/payout',
      data
    );
  }

  rejectRequest(status: string, requestId: string) {
    return this._http.patch<IgenreralResponse>(
      '/v1/payment/withdrawal/rejectWithdraw',
      { status, requestId }
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
