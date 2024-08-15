import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../teacher.service';
import { IcourseDetails } from '../../../../interfaces/courseDetails';
import { ModalService } from '../../../shared/modal.service';
import { IcategoryData } from '../../../../interfaces/categoryData';
import { IfilterValues } from '../../../../interfaces/filterValues';
interface IcourseData {
  _id: string;
  title: string;
  about: string;
  category_id: {
    _id: string;
    title: string;
  };
  contents: string[];
  courseLanguage: string;
  courseLevel: string;
  price: number;
  processingStatus: ProcessingStatus;
}

enum ProcessingStatus {
  Uploading = 'uploading',
  Updating = 'updating',
  Completed = 'completed',
}

@Component({
  selector: 'app-teacher-course-manage',
  templateUrl: './teacher-course-manage.component.html',
  styleUrl: './teacher-course-manage.component.css',
})
export class TeacherCourseManageComponent implements OnInit, OnDestroy {
  totalPages!: number;
  currentPage = 1;
  limit = 6;
  filter: IfilterValues = {
    searchKey: '',
    category_ids: [],
    instructor_ids: [],
    ratingRange: { min: -Infinity, max: Infinity },
    priceRange: { min: -Infinity, max: Infinity },
  };
  search = '';
  courses!: IcourseDetails[];
  categoires!: IcategoryData[];
  isVisible$ = this._modalService.isVisible$;
  isUpdateVisible$ = this._modalService.isUpdateVisible$;
  updateData!: IcourseDetails;

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
    const categories = [];
    if (category.value) {
      categories.push(category.value);
    }
    this.filter.category_ids = categories;
    this.getAllCourses();
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

  openUpdateModal(course: IcourseDetails) {
    this.updateData = course;
    this._modalService.openUpdateComponent();
  }

  closeUpdateModal() {
    this._modalService.closeUpdateComponent();
  }

  updateCourseData(data: IcourseData) {
    const courseIndex = this.courses.findIndex((e) => e._id === data._id);
    if (courseIndex !== -1) {
      this.courses[courseIndex] = {
        ...this.courses[courseIndex],
        ...data
      };
    }
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
