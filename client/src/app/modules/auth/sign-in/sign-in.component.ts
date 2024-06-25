import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { CommonService } from 'src/app/common.service';
import { IuserInformation } from 'src/app/interfaces/interfaces';

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
    private _socialAuthService: SocialAuthService
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

    this._socialAuthService.authState.subscribe((res) => {
      if (res) {
        this.socialLogin = true;
        const data = {
          name: res.name!,
          email: res.email,
          profilePic: res.photoUrl,
          socialId: res.id,
        };
        this.signInWithGoogle(data);
      }
    });
  }

  signInWithGoogle(data: IuserInformation) {
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
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
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
