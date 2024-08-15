import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, map, of, takeUntil, tap } from 'rxjs';
import { StudentService } from '../../student.service';
import { IcourseDetails } from '../../../../interfaces/courseDetails';
import { ModalService } from '../../../shared/modal.service';
import { ToasterService } from '../../../shared/toaster.service';
interface RouterState {
  courseId?: string;
  data?: string;
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
      state.data = '';
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
