import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../shared/modal.service';
import { TeacherService } from '../../teacher.service';
import { ToasterService } from '../../../shared/toaster.service';
@Component({
  selector: 'app-teacher-wallet-withdraw',
  templateUrl: './teacher-wallet-withdraw.component.html',
  styleUrl: './teacher-wallet-withdraw.component.css',
})
export class TeacherWalletWithdrawComponent implements OnInit, OnDestroy {
  withdrawalFrom!: FormGroup;
  step = 1;
  isSubmitted = false;
  resendOtp: boolean = false;
  text1 = '';
  text2 = '';
  text3 = '';
  text4 = '';
  txt4: boolean = false;
  timerInterval: any;
  timer: number = 30;
  otpError = false;

  private _ngUnsubscribe$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _modalService: ModalService,
    private _teacherService: TeacherService,
    private _toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.withdrawalFrom = this._fb.group({
      accountNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)],
      ],
      confirmAccountNumber: ['', [Validators.required]],
      accountHolder: ['', [Validators.required]],
      ifsc: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)],
      ],
      amount: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
      password: ['', [Validators.required]],
      text1: [''],
      text2: [''],
      text3: [''],
      text4: [''],
    });
  }

  get formControls() {
    return this.withdrawalFrom.controls;
  }

  nextStep() {
    const accountNumber = this.withdrawalFrom.get('accountNumber')?.value;
    const confirmAccountNumber = this.withdrawalFrom.get(
      'confirmAccountNumber'
    )?.value;
    if (accountNumber !== confirmAccountNumber) {
      this.withdrawalFrom
        .get('confirmAccountNumber')
        ?.setErrors({ notMatch: true });
    }

    const accountHolder = this.withdrawalFrom.get('accountHolder')?.value;
    if (!accountHolder.trim()) {
      this.withdrawalFrom.get('accountHolder')?.setErrors({ require: true });
    }
    if (this.step === 1 && this.withdrawalFrom.invalid) {
      this.isSubmitted = true;
      return;
    }
    this.sentOtp();
  }

  resendOtpTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.timer = 30;
        this.resendOtp = true;
      }
    }, 1000);
  }

  move(event: any, previous: any, current: any, next: any) {
    const length = current.value.length;
    const maxLength = 1;
    if (length == maxLength) {
      this.txt4 = false;
      if (next) {
        next.focus();
      }
    }
    if (event.key == 'Backspace' && previous) {
      if (current.name === 'text4' && !this.txt4) {
        current.value = '';
        this.txt4 = true;
        return;
      } else {
        this.txt4 = false;
        previous.focus();
        previous.value = '';
      }
    }
  }

  sentOtp() {
    this.resendOtp = false;
    this.sentWithdrawalOtp();
  }

  resentOtp() {
    this.resendOtp = false;
    this.resendOtpTimer();
    this.sentWithdrawalOtp();
  }

  sentWithdrawalOtp() {
    const password = this.withdrawalFrom.get('password')?.value;
    this._teacherService
      .sentWithdrawalOtp(password)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        if (res.success) {
          if (this.step < 2) {
            this.resendOtpTimer();
            this.step++;
          }
        } else {
          this._toasterService.toasterFunction(res);
        }
      });
  }

  closeModal() {
    this._modalService.closeModal();
  }

  onSubmit() {
    const otp = this.text1 + this.text2 + this.text3 + this.text4;

    if (otp.split('').length != 4) {
      this.otpError = true;
      return;
    }

    if (!this.withdrawalFrom.valid) {
      return;
    }
    const data = this.withdrawalFrom.getRawValue();
    data.otp = otp;
    this._teacherService
      .withdrawalRequest(data)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        console.log(res);

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
