import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ToasterService } from '../../../shared/toaster.service';
import { IuserInformation } from '../../../../interfaces/userInformation';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { userLogin } from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  isSubmitted: boolean = false;
  passwordVisibilty: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  value = '';
  socialLogin = false;

  private _ngUnsbscribe = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _toasterService: ToasterService,
    private _socialAuthService: SocialAuthService,
    private _store: Store<AuthState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.pattern(/^.{4,}$/)]],
    });

    this._socialAuthService.authState
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res) {
          this.socialLogin = true;
          const data = {
            name: res.name!,
            email: res.email,
            profilePic: { key: '', url: res.photoUrl },
            socialId: res.id,
          };
          this.handleGoogleSignIn(data);
        }
      });
  }

  handleGoogleSignIn(data: Omit<IuserInformation, 'role'>) {
    this._authService
      .signInWithGoogle(data)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          this._store.dispatch(userLogin({ userDatas: res.userInfo }));
          this._toasterService.showSuccess(res.message);
          this._router.navigate([`./${res.userInfo.role}`]);
        } else {
          this._toasterService.showError(res.message);
        }
      });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  showPassword() {
    this.passwordVisibilty = !this.passwordVisibilty;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }

    const data = this.loginForm.getRawValue();

    this._authService
      .userLogin(data)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          localStorage.setItem('accessToken', res.accessToken!);
          localStorage.setItem('refreshToken', res.refreshToken!);
          this._store.dispatch(userLogin({ userDatas: res.userInfo }));
          this._toasterService.showSuccess(res.message);
          this._router.navigate([`/${res.userInfo.role}`]);
        } else {
          this._toasterService.showError(res.message);
        }
      });
  }

  ngOnDestroy(): void {
    this._ngUnsbscribe.next();
    this._ngUnsbscribe.complete();
    if (this.socialLogin) {
      this._socialAuthService.signOut();
    }
  }
}
