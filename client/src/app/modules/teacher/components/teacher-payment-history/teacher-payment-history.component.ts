import { Component, OnDestroy, OnInit } from '@angular/core';
import { IpaymentDatas } from '../../../../interfaces/paymentData';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../teacher.service';

@Component({
  selector: 'app-teacher-payment-history',
  templateUrl: './teacher-payment-history.component.html',
  styleUrl: './teacher-payment-history.component.css',
})
export class TeacherPaymentHistoryComponent implements OnInit, OnDestroy {
  totalPages = 0;
  currentPage = 1;
  search: string = '';
  filter: string = '';
  limit = 8;
  startDate: string = '';
  endDate: string = '';
  paymentDatas!: IpaymentDatas[];
  filterValues = ['purchase', 'withdrawal'];
  private _ngUnsubscribe$ = new Subject<void>();
  constructor(private _teacherService: TeacherService) {}
  ngOnInit(): void {
    this.getPayments();
  }

  getPayments() {
    this._teacherService
      .getAllPayments(
        this.search,
        this.filter,
        this.startDate,
        this.endDate,
        this.currentPage,
        this.limit
      )
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.paymentDatas = res.data;
        this.totalPages = res.totalPages;
      });
  }

  onSearch(event: string) {
    this.search = event;
    this.currentPage = 1;
    this.getPayments();
  }
  applyDateRange(inputDate: { startDate: string; endDate: string }) {
    this.startDate = inputDate.startDate;
    this.endDate = inputDate.endDate;
    this.currentPage = 1;

    this.getPayments();
  }

  onFilterChange(filterValue: string) {
    this.filter = filterValue;
    this.currentPage = 1;
    this.getPayments();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
