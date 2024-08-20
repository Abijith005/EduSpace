import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';
import { IwithdrawRequest } from '../../../../interfaces/withdrawRequests';
import { ToasterService } from '../../../shared/toaster.service';

@Component({
  selector: 'app-view-withdraw-request',
  templateUrl: './view-withdraw-request.component.html',
  styleUrl: './view-withdraw-request.component.css',
})
export class ViewWithdrawRequestComponent implements OnInit, OnDestroy {
  @Input() requestData!: IwithdrawRequest;
  walletBalance: number = 0;

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _modalService: ModalService,
    private _adminService: AdminService,
    private _toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    const userId = this.requestData.user._id;
    this._adminService
      .getWalletBalance(userId!)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        if (res.success) {
          this.walletBalance = res.walletBalance;
        }
      });
  }

  closeModal() {
    this._modalService.closeModal();
  }

  onApproveRequest() {
    if (this.walletBalance < this.requestData.amount) {
      this._toasterService.showError('Wallet balance is low');
      return;
    }
    const data = {
      accountHolderName: this.requestData.accountHolder,
      accountNumber: this.requestData.accountNumber,
      ifsc: this.requestData.ifsc,
      amount: this.requestData.amount,
      requestId: this.requestData._id,
      userId: this.requestData.user._id!,
    };
    this._adminService
      .approveWithdraw(data)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this._toasterService.toasterFunction(res);
        if (res.success) {
          this.closeModal();
        }
      });
  }

  rejectRequest() {
    this._adminService
      .rejectRequest('rejected', this.requestData._id)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this._toasterService.toasterFunction(res);
        if (res.success) {
          this.closeModal();
        }
      });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
    this._modalService.closeModal();
  }
}
