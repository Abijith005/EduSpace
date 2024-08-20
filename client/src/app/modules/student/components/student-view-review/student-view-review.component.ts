import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../../student.service';
import { Ireview } from '../../../../interfaces/reviews';

@Component({
  selector: 'app-student-view-review',
  templateUrl: './student-view-review.component.html',
  styleUrl: './student-view-review.component.css',
})
export class StudentViewReviewComponent implements OnInit, OnDestroy {
  courseId!: string;
  reviews: Ireview[] = [];
  limit = 15;
  currentPage = 1;
  timer: any;
  private hasScrolled: boolean = false;
  private _ngUnsubscribe$ = new Subject<void>();
  constructor(private _studentService: StudentService) {}

  ngOnInit(): void {
    this.courseId = history.state.courseId;

    this.getReviews();
  }

  getReviews() {
    this._studentService
      .getReviews(this.courseId, this.currentPage, this.limit)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.reviews = [...this.reviews, ...res.reviews];
        console.log(this.reviews.length, 'fdsfsdsd');
      });
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (!this.hasScrolled) {
      this.hasScrolled = true;
      return;
    }
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        console.log('hellooooooooooooooooooooooooooooooo');

        ++this.currentPage;
        this.getReviews();
      }, 300);
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
