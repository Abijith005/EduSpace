import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentService } from '../../student.service';
import { Subject, takeUntil } from 'rxjs';
import { IsubscriptionData } from '../../../../interfaces/subscriptionData';
import { Router } from '@angular/router';
import { ModalService } from '../../../shared/modal.service';
import { IcategoryResponse } from '../../../../interfaces/categoryResponse';

@Component({
  selector: 'app-student-subscription',
  templateUrl: './student-subscription.component.html',
  styleUrl: './student-subscription.component.css',
})
export class StudentSubscriptionComponent implements OnInit, OnDestroy {
  courses!: IsubscriptionData[];
  isVisible$ = this._modalService.isVisible$;
  selectedCourseId: string | null = null;
  search: string = '';
  categories!: IcategoryResponse[];
  filter: string = '';
  currentPage = 1;
  limit = 6;
  totalPages!: number;
  timer: any;
  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _studentService: StudentService,
    private _router: Router,
    private _modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.getCourses();
    this._studentService
      .getAllCategories()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.categories = res.categories;
      });
  }

  getCourses() {
    this._studentService
      .getAllSubscriptions(
        this.search,
        this.filter,
        this.currentPage,
        this.limit
      )
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.courses = res.courses;
        this.totalPages = res.totalPages;
      });
  }

  navigateWithData(course_id: string) {
    this._router.navigate(['/student/subscriptions/course', course_id]);
  }

  openModal(courseId: string) {
    this.selectedCourseId = courseId;
    this._modalService.openModal();
  }

  closeModal(success: boolean) {
    console.log(success);
    
    if (success) {
      const reviewedCourse = this.courses.find(
        (e) => (e.course._id == this.selectedCourseId!)
      );
      if (reviewedCourse) {
        reviewedCourse.review = true;
      }
    }
    this._modalService.closeModal();
  }

  onSearch() {
    if (!this.search.trim()) {
      return;
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.currentPage = 1;
      this.getCourses();
    }, 300);
  }
  onFilterSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.filter = target.value;
      this.currentPage = 1;
      this.getCourses();
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getCourses();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
