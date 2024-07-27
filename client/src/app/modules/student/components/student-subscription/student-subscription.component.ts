import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentService } from '../../student.service';
import { Subject, takeUntil } from 'rxjs';
import { IsubscriptionData } from '../../../../interfaces/subscriptionData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-subscription',
  templateUrl: './student-subscription.component.html',
  styleUrl: './student-subscription.component.css',
})
export class StudentSubscriptionComponent implements OnInit, OnDestroy {
  courses!: IsubscriptionData[];
  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _studentService: StudentService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this._studentService
      .getAllSubscriptions()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.courses = res.courses;
      });
  }

  navigateWithData(course_id:string) {
    this._router.navigate(['/student/subscriptions/course',course_id],);
  }
  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
