import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import {
  ICategoryRequest,
  ICertificate,
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
  requests!: ICategoryRequest[];
  certificates!: ICertificate[];
  selectedRequestId: string | null = null;
  dropdownOpen = false;
  currentRequestId: string | null = null;
  private _ngUnsbscribe = new Subject<void>();

  constructor(
    private _modalService: ModalService,
    private _adminService: AdminService,
    private _toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this._adminService
      .getAllRequests(this.currentPage, this.limit)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        this.requests = res.requests;
        this.totalPages = res.totalPages;
      });
  }

  isVisible$ = this._modalService.isVisible$;

  updateRequestStatus(requestId: string, status: string) {
    this._adminService
      .updateRequest({ requestId, status })
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          this.dropdownOpen = false;
        }
        this._toasterService.toasterFunction(res);
      });
  }

  openModal(request: ICategoryRequest) {
    this.certificates = request.certificates;
    this.selectedRequestId = request._id;
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }
  onPageChanged(page: number) {
    this.currentPage = page;
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
