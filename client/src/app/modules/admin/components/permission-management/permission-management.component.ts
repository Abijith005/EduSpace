import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import {
  IcategoryRequest,
  Icertificate,
} from '../../../../interfaces/categoryRequest';
import { ToasterService } from '../../../shared/toaster.service';

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrl: './permission-management.component.css',
})
export class PermissionManagementComponent implements OnInit, OnDestroy {
  totalPages!: number;
  currentPage = 1;
  limit = 8;
  requests!: IcategoryRequest[];
  certificates!: Icertificate[];
  selectedRequestId: string | null = null;
  dropdownOpen = false;
  currentRequestId: string | null = null;
  filter = '';
  search = '';
  timer: any;
  private _ngUnsbscribe = new Subject<void>();

  constructor(
    private _modalService: ModalService,
    private _adminService: AdminService,
    private _toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.getAllRequests();
  }

  isVisible$ = this._modalService.isVisible$;

  getAllRequests() {
    this._adminService
      .getAllRequests(this.search, this.filter, this.currentPage, this.limit)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        this.requests = res.requests;
        this.totalPages = res.totalPages;
      });
  }

  updateRequestStatus(
    requestId: string,
    status: string,
    category: string,
    user_id: string
  ) {
    this._adminService
      .updateRequest({ requestId, status, category, user_id })
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          this.dropdownOpen = false;
          const request = this.requests.find((e) => e._id == requestId);
          request!.status = status;
        }
        this._toasterService.toasterFunction(res);
      });
  }

  applySearch() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getAllRequests();
    }, 300);
  }
  applyFilter() {
    this.getAllRequests();
  }

  openModal(request: IcategoryRequest) {
    this.certificates = request.certificates;
    this.selectedRequestId = request._id;
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }
  onPageChanged(page: number) {
    this.currentPage = page;
    this.getAllRequests();
  }

  toggleDropdown(requestId: string) {
    this.dropdownOpen = !this.dropdownOpen;
    this.currentRequestId = requestId;
  }

  ngOnDestroy(): void {
    this._ngUnsbscribe.next();
    this._ngUnsbscribe.complete();
  }
}
