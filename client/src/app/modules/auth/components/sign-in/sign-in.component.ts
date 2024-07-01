import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { CommonService } from '../../../shared/toaster.service';
import { IuserInformation } from '../../../../interfaces/userInformation';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { userLogin } from '../../../../store/userAuth.actions';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  role: string = '';
  isSubmitted: boolean = false;
  passwordVisibilty: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  value = '';
  socialLogin = false;

  private _ngUnsbscribe = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _ngToaster: NgToastService,
    private _router: Router,
    private _toasterService: CommonService,
    private _socialAuthService: SocialAuthService,
    private _store:Store<AppState>
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
        if (res && this.role) {
          this.socialLogin = true;
          const data = {
            name: res.name!,
            email: res.email,
            profilePic: res.photoUrl,
            socialId: res.id,
            role: this.role,
          };
          this.handleGoogleSignIn(data);
        } else if (res && !this.role) {
          this._toasterService.showError(
            'Please select the role before signing in with Google'
          );
        }
      });
  }

  handleGoogleSignIn(data: IuserInformation) {
    this._authService
      .signInWithGoogle(data)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
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

  get formControls() {
    return this.loginForm.controls;
  }

  selectRole(newRole: string) {
    this.role = newRole;
  }

  showPassword() {
    this.passwordVisibilty = !this.passwordVisibilty;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    if (!this.role) {
      this._ngToaster.error({
        position: 'topCenter',
        duration: 2000,
        detail: 'Please select the role',
      });
      return;
    }
    const data = this.loginForm.getRawValue();
    data.role = this.role.toLowerCase();

    this._authService
      .userLogin(data)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        if (res.success) {
          localStorage.setItem('accessToken', res.accessToken!);
          localStorage.setItem('refreshToken', res.refreshToken!);
          this._store.dispatch(userLogin({userDatas:res.userinfo}))
          this._toasterService.showSuccess(res.message);
          this._router.navigate([`/${this.role}`]);
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
