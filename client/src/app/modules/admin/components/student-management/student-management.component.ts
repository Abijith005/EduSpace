import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { IstudentDetails } from '../../../../interfaces/studentDetails';
import { ToasterService } from '../../../shared/toaster.service';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.css',
})
export class StudentManagementComponent implements OnInit {
  totalPages = 10;
  currentPage = 1;
  search = '';
  filter: boolean | null = null;
  limit = 8;
  studentDetails: IstudentDetails[] | null = null;
  currentStudentId: string | null = null;
  dropdownOpen = false;
  timer: any;

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _adminService: AdminService,
    private _toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.getAllStudentsData();
  }
  onPageChanged(page: number) {
    this.currentPage = page;
  }

  getAllStudentsData() {
    this._adminService
      .getAllStudents(this.search, this.filter, this.currentPage, this.limit)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.studentDetails = res.studentsDetails;
        this.totalPages = res.totalPages;
      });
  }
  applySearch() {
    this.search = this.search.trim();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getAllStudentsData();
    }, 300);
  }
  applyFilter() {

    this.getAllStudentsData();
  }

  toggleDropdown(studentId: string) {
    if (this.currentStudentId == studentId) {
      this.dropdownOpen = false;
      this.currentStudentId = null;
      return;
    }
    this.dropdownOpen = true;
    this.currentStudentId = studentId;
  }

  updatestudent(studentId: string, status: boolean) {
    this.dropdownOpen = false;
    this.currentStudentId = null;
    this._adminService
      .updateStudentStatus(studentId, status)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        if (res.success) {
          const student = this.studentDetails?.find((e) => e._id == studentId);
          if (student) {
            student.activeStatus = status;
          }
        }
        this._toasterService.toasterFunction(res);
      });
  }
}
