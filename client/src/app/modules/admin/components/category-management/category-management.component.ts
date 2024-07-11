import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { IcategoryResponse } from '../../../../interfaces/categoryResponse';
import { ToasterService } from '../../../shared/toaster.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css',
})
export class CategoryManagementComponent implements OnInit, OnDestroy {
  isVisible$ = this._modalService.isVisible$;
  totalPages!: number;
  currentPage = 1;
  limit = 8;
  categories!: IcategoryResponse[];
  dropdownOpen = false;
  currentCategoryId: string | null = null;

  private _ngUnsbscribe = new Subject<void>();
  constructor(
    private _modalService: ModalService,
    private _adminService: AdminService,
    private _toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this._adminService
      .getAllCategories(this.currentPage, this.limit)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        this.categories = res.categories;
        this.totalPages = res.totalPages;
      });
  }

  openModal() {
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }

  toggleDropdown(requestId: string) {
    this.dropdownOpen = !this.dropdownOpen;
    this.currentCategoryId = requestId;
  }

  updateCategoryStatus(categoryId: string, status: boolean) {
    this._adminService
      .updateCategoryStatus({ categoryId, status })
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        this._toasterService.toasterFunction(res);
        if (res.success) {
          this.dropdownOpen = false;
        }
      });
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this._adminService
      .getAllCategories(this.currentPage, this.limit)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        this.categories = res.categories;
        this.totalPages = res.totalPages;
      });
  }
  ngOnDestroy(): void {
    this._ngUnsbscribe.next();
    this._ngUnsbscribe.complete();
  }
}
