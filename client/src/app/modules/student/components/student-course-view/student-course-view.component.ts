import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subject, filter, map, of, takeUntil, tap } from 'rxjs';
import { StudentService } from '../../student.service';
import { ICourseDetails } from '../../../../interfaces/courseDetails';

@Component({
  selector: 'app-student-course-view',
  templateUrl: './student-course-view.component.html',
  styleUrl: './student-course-view.component.css',
})
export class StudentCourseViewComponent implements OnInit, OnDestroy {
  navItems = [
    { link: './about', title: 'About' },
    { link: './reviews', title: 'Reviews' },
  ];

  currentUrl = '';
  course_id = '';
  // courseDetails!: ICourseDetails;
  courseDetails$ = of<ICourseDetails | null>(null);
  isLoading$ = of(true);
  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _studentService: StudentService
  ) {}
  ngOnInit(): void {
    this.course_id = this._activatedRoute.snapshot.paramMap.get('id')!;
    this.currentUrl = this._router.url;

    this.getCourseDetails();

    this._router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  getCourseDetails() {
    this.courseDetails$ = this._studentService
      .getCourseDetails(this.course_id)
      .pipe(
        takeUntil(this._ngUnsubscribe$),
        tap(() => (this.isLoading$ = of(false))),
        map((response) => response.courseDetails)
      );
  }

  isActive(link: string): boolean {
    const url = this.currentUrl.split('/').pop();

    return url === link.replace('./', '');
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
