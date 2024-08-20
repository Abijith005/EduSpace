import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ToasterService } from '../../../shared/toaster.service';
import { StudentService } from '../../student.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent implements OnDestroy {
  @Input() courseId!: string;
  @Output() modalClosed = new EventEmitter<boolean>();
  stars = new Array(5).fill(0);
  rating: number = 0;
  feedback: string | null = null;

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _toasterService: ToasterService,
    private _studentService: StudentService
  ) {}

  closeModal(success: boolean) {
    this.modalClosed.emit(success);
  }

  rateCourse(value: number) {
    this.rating = value + 1;
  }

  submitReview() {
    if (!this.rating) {
      this._toasterService.showError('Please rate the course');
      return;
    }
    if (!this.feedback) {
      this._toasterService.showError('Please enter the feedback');
      return;
    }
    this._studentService
      .reviewCourse(this.courseId, this.rating, this.feedback)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this._toasterService.toasterFunction(res);
        if (res.success) {
          this.closeModal(true);
        }
      });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
