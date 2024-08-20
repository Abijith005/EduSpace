import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { IpaymentDatas } from '../../../../interfaces/paymentData';

@Component({
  selector: 'app-payment-managemet',
  templateUrl: './payment-managemet.component.html',
  styleUrl: './payment-managemet.component.css',
})
export class PaymentManagemetComponent implements OnInit, OnDestroy {
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
  constructor(private _adminService: AdminService) {}
  ngOnInit(): void {
    this.getPayments();
  }

  getPayments() {
    this._adminService
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
