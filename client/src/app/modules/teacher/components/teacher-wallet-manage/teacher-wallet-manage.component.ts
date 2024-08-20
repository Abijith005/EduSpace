import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { TeacherService } from '../../teacher.service';
import { Subject, takeUntil } from 'rxjs';
import { IwithdrawRequest } from '../../../../interfaces/withdrawRequests';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectUserInfo } from '../../../../store/auth/auth.selector';

@Component({
  selector: 'app-teacher-wallet-manage',
  templateUrl: './teacher-wallet-manage.component.html',
  styleUrl: './teacher-wallet-manage.component.css',
})
export class TeacherWalletManageComponent implements OnInit {
  isWithdrawVisibe$ = this._modalService.isVisible$;
  isWithdrawUpdateVisibe$ = this._modalService.isNestedVisible$;
  totalPages = 0;
  currentPage = 1;
  filter: string = '';
  limit = 8;
  startDate: string = '';
  endDate: string = '';
  filterValues = ['pending', 'approved', 'rejected'];
  withdrawRequests!: IwithdrawRequest[];
  selectedRequest: IwithdrawRequest | null = null;
  walletBalance: number = 0;

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _modalService: ModalService,
    private _teacherService: TeacherService,
    private _store: Store<{ user: AuthState }>
  ) {}

  ngOnInit(): void {
    this.getWalletDatas();
    this._store
      .select(selectUserInfo)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        const userId = res._id;
        this.getWalletBalance(userId!);
      });
  }

  getWalletBalance(userId: string) {
    this._teacherService
      .getWalletBalance(userId)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.walletBalance = res.walletBalance;
      });
  }

  getWalletDatas() {
    this._teacherService
      .userWithdrawalData(
        this.filter,
        this.startDate,
        this.endDate,
        this.currentPage,
        this.limit
      )
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.withdrawRequests = res.data;
        this.totalPages = res.totalPages;
      });
  }

  openWitdrawModal() {
    this._modalService.openModal();
  }

  applyDateRange(inputDate: { startDate: string; endDate: string }) {
    this.startDate = inputDate.startDate;
    this.endDate = inputDate.endDate;
    this.currentPage = 1;

    this.getWalletDatas();
  }

  onFilterChange(filterValue: string) {
    console.log(filterValue,this.filter);
    
    this.filter = filterValue;
    console.log(filterValue,this.filter);
    this.currentPage = 1;
    this.getWalletDatas();
  }

  openUpdateModal(request: IwithdrawRequest) {
    this.selectedRequest = request;
    this._modalService.openNestedModal();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
