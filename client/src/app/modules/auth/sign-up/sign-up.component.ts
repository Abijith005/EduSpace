import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import {
  IuserInformation,
} from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  isSubmitted: boolean = false;
  resendOtp: boolean = false;
  registerForm: FormGroup = new FormGroup({});
  timer: number = 30;
  timerfun: number | null = null;
  otp: boolean = false;
  txt4: boolean = false;
  text1 = '';
  text2 = '';
  text3 = '';
  text4 = '';
  email = '';
  socialLogin=false
  roles=["Student","Teacher",]

  private _ngUnsbscribe = new Subject<void>();
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _toasterService: CommonService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      role:['',Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^.{4,}$/)]],
      confirmPassword: ['', [Validators.required]],
    });

    this._socialAuthService.authState
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res) {
          this.socialLogin=true
          const data = {
            name: res.name!,
            email: res.email,
            profilePic: res.photoUrl,
            socialId: res.id,
          };
          this.signUpWithGoogle(data);
        }
      });
  }

  signUpWithGoogle(data: IuserInformation): void {
    this._authService
      .signInWithGoogle(data)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          this._toasterService.showSuccess(res.message);
          this._router.navigate(['/home']);
        } else {
          this._toasterService.showError(res.message);
        }
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
    return this.registerForm.controls;
  }

  sentOtp() {
    this.isSubmitted = true;
    if (!this.registerForm.valid) {
      return;
    }
    if (
      this.registerForm.get('password')?.value !=
      this.registerForm.get('confirmPassword')?.value
    ) {
      this.registerForm.get('confirmPassword')?.setErrors({ match: true });
      return;
    }
    this.email = this.formControls['email'].value;
    const role=this.formControls['role'].value
    this.resendOtp = false;
    this.resendOtpTimer();
    this._authService
      .sendOtp(this.email,role)
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
    const data = this.registerForm.getRawValue();
    console.log(data);
    
    let otpValue =
      form.value.text1 + form.value.text2 + form.value.text3 + form.value.text4;

    data.otp = otpValue;
    this._authService
      .userRegister(data)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          this._toasterService.showSuccess(res.message);
          this._router.navigate(['../signIn'], {
            relativeTo: this._activeRoute,
          });
        } else {
          this._toasterService.showError(res.message);
        }
      });
  }

  cursorChange(event: any, previous: any, current: any, next: any) {
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
    if (this.socialLogin) {
      this._socialAuthService.signOut();
    }
  }
}
