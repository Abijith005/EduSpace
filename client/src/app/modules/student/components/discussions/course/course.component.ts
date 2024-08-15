import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IcourseDetails } from '../../../../../interfaces/courseDetails';
import { StudentService } from '../../../student.service';
import { Subject, filter, map, of, takeUntil, tap } from 'rxjs';
import { SharedDataService } from '../../../shared-data.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit, OnDestroy {
  course$ = of<IcourseDetails | null>(null);
  selectedVideo: { url: string; key: string } | null = null;
  isLoading$ = of(true);
  course_id!: string;
  navItems = [
    { link: './lessons', title: 'Lessons' },
    { link: './notes', title: 'Notes' },
  ];
  currentUrl = '';

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _studentService: StudentService,
    private _router: Router,
    private _sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.currentUrl = this._router.url;

    this._activatedRoute.paramMap.subscribe((params) => {
      this.course_id = params.get('id')!;
    });
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
    this.course$ = this._studentService.getCourseDetails(this.course_id).pipe(
      takeUntil(this._ngUnsubscribe$),
      tap(() => (this.isLoading$ = of(false))),
      map((response) => {
        this._sharedDataService.setCourseData(response.courseDetails);
        return response.courseDetails;
      })
    );
  }

  changeVideo(video: { key: string; url: string }) {
    this.selectedVideo = video;
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
