import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { IwithdrawRequest } from '../../../../interfaces/withdrawRequests';

@Component({
  selector: 'app-withdrawal-manage',
  templateUrl: './withdrawal-manage.component.html',
  styleUrl: './withdrawal-manage.component.css',
})
export class WithdrawalManageComponent implements OnInit, OnDestroy {
  totalPages = 0;
  currentPage = 1;
  search: string = '';
  filter: string = '';
  limit = 8;
  filterValues = ['pending', 'approved', 'rejected'];
  isRequestVisibe$ = this._modalService.isVisible$;
  withdrawDatas!: IwithdrawRequest[];
  startDate: string = '';
  endDate: string = '';
  selectedRequestData!: IwithdrawRequest;
  private _ngUnsubscribe$ = new Subject<void>();

  constructor(
    private _modalService: ModalService,
    private _adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getRequests();
  }

  getRequests() {
    this._adminService
      .getWithdrawalRequests(
        this.search,
        this.filter,
        this.startDate,
        this.endDate,
        this.currentPage,
        this.limit
      )
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        if (res.success) {
          this.totalPages = res.totalPages;
          this.withdrawDatas = res.data;
        }
      });
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.getRequests();
  }

  viewRequest(requestData: IwithdrawRequest) {
    this.selectedRequestData = requestData;
    this._modalService.openModal();
  }

  onSearch(event: string) {
    this.search = event;
    this.currentPage = 1;
    this.getRequests();
  }
  applyDateRange(inputDate: { startDate: string; endDate: string }) {
    this.startDate = inputDate.startDate;
    this.endDate = inputDate.endDate;
    this.currentPage = 1;

    this.getRequests();
  }

  onFilterChange(filterValue: string) {
    this.filter = filterValue;
    this.currentPage = 1;
    this.getRequests();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
    this._modalService.closeModal();
  }
}
