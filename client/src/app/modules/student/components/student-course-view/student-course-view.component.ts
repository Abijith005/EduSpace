import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {  Subject, filter, map, of, takeUntil, tap } from 'rxjs';
import { StudentService } from '../../student.service';
import { ICourseDetails } from '../../../../interfaces/courseDetails';

@Component({
  selector: 'app-student-course-view',
  templateUrl: './student-course-view.component.html',
  styleUrl: './student-course-view.component.css',
})
export class StudentCourseViewComponent implements OnInit, OnDestroy,AfterViewInit {
  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;
  navItems = [
    { link: './about', title: 'About' },
    { link: './reviews', title: 'Reviews' },
  ];

  currentUrl = '';
  course_id = '';
  // courseDetails!: ICourseDetails;
  courseDetails$ = of<ICourseDetails | null>(null);
  isLoading$ = of(true);
  courseDetails = { price: 500 };
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

  // buy(){
  //   window.paypal.Buttons().render(this.paymentRef.nativeElement)
  // }


  ngAfterViewInit() {
    // After the view is fully initialized, render the PayPal button
    this.loadPayPalButton();
  }

  loadPayPalButton() {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.courseDetails.price.toString(),
              currency_code: 'INR'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert('Transaction completed by ' + details.payer.name.given_name);
          // Optionally handle the successful payment here
        });
      }
    }).render(this.paymentRef.nativeElement);
  }

  buy() {
    // Render PayPal button when the "Buy" button is clicked
    this.loadPayPalButton();
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
