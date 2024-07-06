import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { IcategoryResponse } from '../../../../interfaces/categoryResponse';

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

  private _ngUnsbscribe = new Subject<void>();
  constructor(
    private _modalService: ModalService,
    private _adminService: AdminService
  ) {}

  ngOnInit(): void {
    this._adminService
      .getAllCategories(this.currentPage, this.limit)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        this.categories = res.data;
        this.totalPages = res.totalPages;
      });
  }

  openModal() {
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this._adminService
      .getAllCategories(this.currentPage, this.limit)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        console.log(res);

        this.categories = res.data;
        console.log(this.categories);
      });
  }
  ngOnDestroy(): void {
    this._ngUnsbscribe.next();
    this._ngUnsbscribe.complete();
  }
}
