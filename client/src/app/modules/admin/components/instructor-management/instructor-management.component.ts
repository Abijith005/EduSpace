import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { IinstructorDetails } from '../../../../interfaces/instructorDetails';
import { ModalService } from '../../../shared/modal.service';
import { ToasterService } from '../../../shared/toaster.service';
interface Icategories {
  _id: string;
  title: string;
}
@Component({
  selector: 'app-instructor-management',
  templateUrl: './instructor-management.component.html',
  styleUrl: './instructor-management.component.css',
})
export class InstructorManagementComponent implements OnInit, OnDestroy {
  totalPages = 0;
  limit = 8;
  currentPage = 1;
  search = '';
  filter: boolean | null = null;
  timer: any;
  instructorDetails!: IinstructorDetails[];
  dropdownOpen = false;
  currentInstructorId: string | null = null;
  selecteddCategories: Icategories[] | null = null;
  updateUserId: string | null = null;

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _adminService: AdminService,
    private _modalService: ModalService,
    private _toasterService: ToasterService
  ) {}
  ngOnInit(): void {
    this.getAllDatas();
  }

  isVisible$ = this._modalService.isVisible$;

  getAllDatas() {
    this._adminService
      .getAllInstructors(this.search, this.filter, this.currentPage, this.limit)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.instructorDetails = res.instructorDetails;
        this.totalPages = res.totalPages;
      });
  }

  applyFilter() {
    this.getAllDatas();
  }

  applySearch() {
    this.search = this.search.trim();
    clearTimeout(this.timer);
    setTimeout(() => {
      this.getAllDatas();
    }, 300);
  }

  toggleDropdown(instructorId: string) {
    if (this.currentInstructorId == instructorId) {
      this.dropdownOpen = false;
      this.currentInstructorId = null;
      return;
    }
    this.dropdownOpen = true;
    this.currentInstructorId = instructorId;
  }

  openModal(categories: Icategories[], userId: string) {
    this.dropdownOpen = false;
    this.currentInstructorId = null;
    if (categories.length > 0) {
      this._modalService.openModal();
      this.selecteddCategories = categories;
      this.updateUserId = userId;
    }
  }

  closeModal() {
    this._modalService.closeModal();
  }

  updateInstructor(instructorId: string, status: boolean) {
    this.dropdownOpen = false;
    this.currentInstructorId = null;

    this._adminService
      .updateInstructorStatus(instructorId, status)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        if (res.success) {
          const instructor = this.instructorDetails.find(
            (item) => item._id == instructorId
          );
          if (instructor) {
            instructor.activeStatus = status;
          }
        }
        this._toasterService.toasterFunction(res);
      });
  }

  updateData(removedCategories: string[]) {
    const instructor = this.instructorDetails.find(
      (item) => item._id == this.updateUserId
    );
    if (instructor) {
      instructor.categories = instructor.categories.filter(
        (item) => !removedCategories.includes(item._id)
      );
    }
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }
  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
