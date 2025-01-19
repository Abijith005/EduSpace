import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  Observable,
  Subject,
  filter,
  finalize,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { StudentService } from '../../student.service';
import { IcourseDetails } from '../../../../interfaces/courseDetails';
import { ModalService } from '../../../shared/modal.service';
import { ToasterService } from '../../../shared/toaster.service';
interface RouterState {
  courseId?: string;
  data?: any;
}
interface aboutData {
  contents: string[];
  about: string;
}
@Component({
  selector: 'app-student-course-view',
  templateUrl: './student-course-view.component.html',
  styleUrl: './student-course-view.component.css',
})
export class StudentCourseViewComponent implements OnInit, OnDestroy {
  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;
  navItems = [
    { link: './about', title: 'About' },
    { link: './reviews', title: 'Reviews' },
  ];

  currentUrl = '';
  courseId = '';
  isVisible$ = this._modalService.isVisible$;
  isNestedVisible$ = this._modalService.isNestedVisible$;
  courseDetails$ = of<IcourseDetails | null>(null);
  isLoading$ = of(true);
  data!: aboutData;
  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _studentService: StudentService,
    private _modalService: ModalService,
    private _toasterService: ToasterService
  ) {}
  ngOnInit(): void {
    this.courseId = this._activatedRoute.snapshot.paramMap.get('id')!;
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

  openPaymentModal() {
    this._studentService
      .isSubscribed(this.courseId)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        if (res.subscribed) {
          this._toasterService.showWarning('Course already subscribed');
          return;
        }
        this._modalService.openModal();
      });
  }

  navigate(link: string) {
    let state: RouterState = {};
    if (link == './reviews') {
      state.courseId = this.courseId;
    }
    if (link == './about') {
      state.data = this.data;
    }
    this._router.navigate([link], { state, relativeTo: this._activatedRoute });
  }

  closePaymentModal() {
    this._modalService.closeModal();
  }
  closeNestedModal() {
    this._modalService.closeNestedModal();
    this._router.navigate(['']);
  }

  getCourseDetails() {
    this.courseDetails$ = this._studentService
      .getCourseDetails(this.courseId)
      .pipe(
        tap(() => (this.isLoading$ = of(false))),
        switchMap((response) => {
          const videoUrls = response.courseDetails.videos.map(
            (video) => video.url
          );
          return this.calculateTotalVideoDuration(videoUrls).pipe(
            map((duration) => {
              this.data = {
                about: response.courseDetails.about,
                contents: response.courseDetails.contents,
              };
              let state: RouterState = {};
              state.data = this.data;
              this._router.navigate(['./about'], {
                state,
                relativeTo: this._activatedRoute,
              });
              return {
                ...response.courseDetails,
                totalVideoDuration: duration,
              };
            })
          );
        }),
        finalize(() => (this.isLoading$ = of(false)))
      );
  }
  calculateTotalVideoDuration(urls: string[]): Observable<number> {
    const durations$ = urls.map((url) => this.getVideoDuration(url));
    return new Observable<number>((observer) => {
      Promise.all(durations$)
        .then((durations) => {
          const totalDuration = durations.reduce(
            (acc, duration) => acc + duration,
            0
          );
          observer.next(totalDuration);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }

  getVideoDuration(url: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        resolve(video.duration);
      });
      video.addEventListener('error', reject);
    });
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
