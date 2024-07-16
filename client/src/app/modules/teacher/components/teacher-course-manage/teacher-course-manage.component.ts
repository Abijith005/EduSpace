import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../teacher.service';
import { ICourseDetails } from '../../../../interfaces/courseDetails';
import { ModalService } from '../../../shared/modal.service';
import { IcategoryData } from '../../../../interfaces/categoryData';

@Component({
  selector: 'app-teacher-course-manage',
  templateUrl: './teacher-course-manage.component.html',
  styleUrl: './teacher-course-manage.component.css',
})
export class TeacherCourseManageComponent implements OnInit, OnDestroy {
  totalPages!: number;
  currentPage = 1;
  limit = 6;
  search = '';
  filter = '';
  courses!: ICourseDetails[];
  categoires!: IcategoryData[];
  isVisible$ = this._modalService.isVisible$;
  isUpdateVisible$ = this._modalService.isUpdateVisible$;
  updateData!:ICourseDetails

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _modalService: ModalService,
    private _teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.getAllCourses();
    this._teacherService
      .getAllowedCategories()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.categoires = res.categories;
      });
  }

  getAllCourses() {
    this._teacherService
      .getAllCourses(this.currentPage, this.limit, this.search, this.filter)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.courses = res.courses;        
        this.totalPages = res.totalPages;
      });
  }

  onFilterSelect(event: Event) {
    const category = event.target as HTMLInputElement;
    if (category) {
      this.filter = category.value;
      this.getAllCourses();
    }
  }

  debounce!: any;
  onSearch() {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.getAllCourses();
    }, 500);
  }

  openUploadModal() {
    this._modalService.openModal();
  }

  closeUploadModal() {
    this._modalService.closeModal();
  }

  openUpdateModal(course:ICourseDetails) {
    this.updateData=course
    this._modalService.openUpdateComponent();
  }

  closeUpdateModal() {
    this._modalService.closeUpdateComponent();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.getAllCourses();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
