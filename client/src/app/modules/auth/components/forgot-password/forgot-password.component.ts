import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToasterService } from '../../../shared/toaster.service';
import { AuthState } from '../../../../store/auth/auth.state';
import { resetPasswordOtp } from '../../../../store/auth/auth.actions';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  isSubmitted: boolean = false;
  resendOtp: boolean = false;
  passwordForm: FormGroup = new FormGroup({});
  timer: number = 30;
  timerfun: number | null = null;
  otp: boolean = false;
  txt4: boolean = false;
  text1 = '';
  text2 = '';
  text3 = '';
  text4 = '';
  data!:{email:string}
  private _ngUnsbscribe = new Subject<void>();
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _toasterService: ToasterService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _store:Store<AuthState>
  ) {}

  ngOnInit(): void {
    this.passwordForm = this._fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],

    });
  }

  resendOtpTimer() {
    const tmier = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(tmier);
        this.timer = 30;
        this.resendOtp = true;
      }
    }, 1000);
  }

  get formControls() {
    return this.passwordForm.controls;
  }

  sentOtp() {
    this.isSubmitted = true;
    if (!this.passwordForm.valid) {
      return;
    }
    this.data=this.passwordForm.getRawValue()
    this.resendOtp = false;
    this.resendOtpTimer();
    this._authService
      .forgotPassword(this.data.email)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          this.otp = true;
          this._toasterService.showSuccess(res.message);
        } else {
          this._toasterService.showError(res.message);
        }
      });
  }

  onSubmit(form: NgForm) {
    let otpValue =
      form.value.text1 + form.value.text2 + form.value.text3 + form.value.text4;

    this._authService
      .verifyOtp(this.data.email, otpValue)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          this._toasterService.showSuccess(res.message);          
          this._store.dispatch(resetPasswordOtp({email:this.data.email}))
          this._router.navigate(['../resetPassword'], {
            relativeTo: this._activeRoute,
          });
        } else {
          this._toasterService.showError(res.message);
        }
      });
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

  ngOnDestroy(): void {
    this._ngUnsbscribe.next();
    this._ngUnsbscribe.complete();
  }
}
