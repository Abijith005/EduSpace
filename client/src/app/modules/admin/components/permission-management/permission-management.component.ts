import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { ICategoryRequest } from '../../../../interfaces/categoryRequest';

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrl: './permission-management.component.css',
})
export class PermissionManagementComponent implements OnInit, OnDestroy {
  totalPages!:number
  currentPage = 1;
  limit=8
  data!:ICategoryRequest[]
  private _ngUnsbscribe = new Subject<void>();

  constructor(
    private _modalService: ModalService,
    private _adminService: AdminService
  ) {}

  ngOnInit(): void {
    this._adminService
      .getAllRequests(this.currentPage,this.limit)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        console.log(res);
        
        this.data=res.requests
        this.totalPages=res.totalPages        
      });
  }

  isVisible$ = this._modalService.isVisible$;
  isDropdownOpen = false;

  toggleDropdown() {
    console.log('isdeorpwon', this.isDropdownOpen);

    this.isDropdownOpen = !this.isDropdownOpen;
  }

  verify() {
    // Verify logic here
    this.isDropdownOpen = false;
  }

  reject() {
    // Reject logic here
    this.isDropdownOpen = false;
  }
  openModal() {
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }
  onPageChanged(page: number) {
    this.currentPage = page;
  }

  ngOnDestroy(): void {
    this._ngUnsbscribe.next();
    this._ngUnsbscribe.complete();
  }
}
