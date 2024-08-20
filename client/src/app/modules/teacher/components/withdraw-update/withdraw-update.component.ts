import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../shared/modal.service';
import { IwithdrawRequest } from '../../../../interfaces/withdrawRequests';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../teacher.service';
import { ToasterService } from '../../../shared/toaster.service';

interface withdrawFormData {
  accountHolder: string;
  accountNumber: number;
  amount: number;
  ifsc: string;
}
@Component({
  selector: 'app-withdraw-update',
  templateUrl: './withdraw-update.component.html',
  styleUrl: './withdraw-update.component.css',
})
export class WithdrawUpdateComponent implements OnInit {
  @Input() requestData!: IwithdrawRequest;
  withdrawalForm!: FormGroup;
  isSubmitted = false;
  step = 1;
  otpError = false;
  text1 = '';
  text2 = '';
  text3 = '';
  text4 = '';
  txt4: boolean = false;
  resendOtp: boolean = false;
  timerInterval: any;
  timer: number = 30;
  initialValues!: withdrawFormData;

  private _ngUnsubscribe$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _modalService: ModalService,
    private _teacherService: TeacherService,
    private _toasterService: ToasterService
  ) {}
  ngOnInit(): void {
    this.withdrawalForm = this._fb.group({
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

    this.withdrawalForm.patchValue(this.requestData);
    this.initialValues = {
      accountNumber: this.requestData.accountNumber,
      accountHolder: this.requestData.accountHolder,
      ifsc: this.requestData.ifsc,
      amount: this.requestData.amount,
    };

    if (this.requestData.status!='pending') {
      this.withdrawalForm.disable()
    }
  }

  get formControls() {
    return this.withdrawalForm.controls;
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

  sentWithdrawalOtp() {
    const password = this.withdrawalForm.get('password')?.value;
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

  sentOtp() {
    this.resendOtp = false;
    this.sentWithdrawalOtp();
  }

  resentOtp() {
    this.resendOtp = false;
    this.resendOtpTimer();
    this.sentWithdrawalOtp();
  }

  nextStep() {
    if (this.requestData.status!='pending') {
      console.log('not oending');
      
      return
    }
    const accountNumber = this.withdrawalForm.get('accountNumber')?.value;
    const confirmAccountNumber = this.withdrawalForm.get(
      'confirmAccountNumber'
    )?.value;

    if (accountNumber != confirmAccountNumber) {
      this.withdrawalForm
        .get('confirmAccountNumber')
        ?.setErrors({ notMatch: true });
    }

    const accountHolder = this.withdrawalForm.get('accountHolder')?.value;
    if (!accountHolder.trim()) {
      this.withdrawalForm.get('accountHolder')?.setErrors({ require: true });
    }
    if (this.step === 1 && this.withdrawalForm.invalid) {
      this.isSubmitted = true;
      return;
    }

    const currentValues: withdrawFormData = {
      accountHolder,
      accountNumber,
      amount: this.withdrawalForm.get('amount')?.value,
      ifsc: this.withdrawalForm.get('ifsc')?.value,
    };

    const valuesChanged = (
      Object.keys(currentValues) as (keyof withdrawFormData)[]
    ).some((key) => currentValues[key] != this.initialValues[key]);

    if (!valuesChanged) {
      this._toasterService.showError('Values not changed');
      return;
    }

    this.sentOtp();
  }

  closeModal() {
    this._modalService.closeNestedModal();
  }

  onSubmit() {
    const otp = this.text1 + this.text2 + this.text3 + this.text4;

    if (otp.split('').length != 4) {
      this.otpError = true;
      return;
    }

    if (!this.withdrawalForm.valid) {
      return;
    }
    const data = this.withdrawalForm.getRawValue();
    data.otp = otp;
    data.requestId = this.requestData._id;
    this._teacherService
      .updateWithdrawalRequest(data)
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
