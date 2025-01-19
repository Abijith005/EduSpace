import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../../student.service';
import { IcategoryResponse } from '../../../../interfaces/categoryResponse';
import { IcategoryData } from '../../../../interfaces/categoryData';
import { ActivatedRoute, Router } from '@angular/router';
import { IcourseDetails } from '../../../../interfaces/courseDetails';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css'],
})
export class StudentHomeComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe$ = new Subject<void>();
  featuredCourses!: IcourseDetails[];
  activeStudents: number = 0;
  activeTeachers: number = 0;
  totalCourses: number = 0;

  categories!: IcategoryResponse[];

  constructor(
    private _studentService: StudentService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._studentService
      .getAllCategories()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.categories = res.categories;
      });

    this.getFeaturedCorses();
    this.getStatus();
  }

  scrollTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  getFeaturedCorses() {
    this._studentService
      .getFeaturedCourses()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.featuredCourses = res.courseDetails;
        this.totalCourses = res.totalCount;
      });
  }

  // getComments() {
  //   this._studentService
  //     .getComments()
  //     .pipe(takeUntil(this._ngUnsubscribe$))
  //     .subscribe();
  // }

  getStatus() {
    this._studentService
      .getStatus()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.activeStudents = res.students;
        this.activeTeachers = res.teachers;
      });
  }

  navigateToCourse(category: IcategoryData) {
    this._router.navigate(['./course'], {
      relativeTo: this._activatedRoute,
      state: { category },
    });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
