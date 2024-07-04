import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ToasterService } from '../../../shared/toaster.service';
import { IuserInformation } from '../../../../interfaces/userInformation';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { userLogin } from '../../../../store/auth/auth.actions';

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
  socialLogin = false;
  role = '';
  roles = ['Student', 'Teacher'];

  private _ngUnsbscribe = new Subject<void>();
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _toasterService: ToasterService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _socialAuthService: SocialAuthService,
    private _store:Store<AuthState>
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
      password: ['', [Validators.required, Validators.pattern(/^.{4,}$/)]],
      confirmPassword: ['', [Validators.required]],
    });

    this._socialAuthService.authState
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res && this.role) {
          this.socialLogin = true;
          const data = {
            name: res.name!,
            email: res.email,
            profilePic: res.photoUrl,
            socialId: res.id,
            role: this.role,
          };
          this.handleGoogleSignUp(data);
        } else if (res && !this.role) {
          this._toasterService.showError(
            'Please select the role before signing in with Google'
          );
        }
      });
  }

  handleGoogleSignUp(data: IuserInformation): void {
    this._authService
      .signInWithGoogle(data)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          console.log(res.userInfo);
          
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          this._store.dispatch(userLogin({userDatas:res.userInfo}))
          this._toasterService.showSuccess(res.message);
          this._router.navigate([`./${this.role}`]);
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
    const role = this.role;
    console.log('sent otp', role, !role);

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
    if (!role) {
      this._toasterService.showError('Please select the role');
      return;
    }
    this.email = this.formControls['email'].value;
    this.resendOtp = false;
    this.resendOtpTimer();
    this._authService
      .sendOtp(this.email, role)
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

  selectRole(newRole: string) {
    this.role = newRole;
  }

  onSubmit(form: NgForm) {
    const data = this.registerForm.getRawValue();
    let otpValue =
      form.value.text1 + form.value.text2 + form.value.text3 + form.value.text4;

    data.otp = otpValue;
    data.role = this.role;
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
