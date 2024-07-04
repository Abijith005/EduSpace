import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AuthService } from '../../auth.service';
import { ToasterService } from '../../../shared/toaster.service';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectUserResetState } from '../../../../store/auth/auth.selector';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  isSubmitted: boolean = false;
  passwordForm: FormGroup = new FormGroup({});
  email = '';
  userInformations: any;

  private _ngUnsubscribe = new Subject<void>();
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _commonSerivce: ToasterService,
    private _store: Store<AuthState>
  ) {}

  ngOnInit(): void {
    this._store.pipe(select(selectUserResetState)).subscribe((res) => {
      this.email = res.email;
    });

    this.passwordForm = this._fb.group({
      password: ['', [Validators.required, Validators.pattern(/^.{4,}$/)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get formControls() {
    return this.passwordForm.controls;
  }

  onSubmit() {

    this.isSubmitted = true;
    if (!this.passwordForm.valid) {
      return;
    }
    if (
      this.passwordForm.get('password')?.value !=
      this.passwordForm.get('confirmPassword')?.value
    ) {
      this.passwordForm.get('confirmPassword')?.setErrors({ match: true });
      return;
    }
    const password = this.passwordForm.get('password')?.value;
    const data = { password: password, email: this.email };
    this._authService
      .updatePassword(data)
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((res) => {
        if (res.success) {
          this._commonSerivce.showSuccess(res.message);
          this._router.navigate(['../../'], {
            relativeTo: this._activatedRoute,
            replaceUrl: true,
          });
        } else {
          this._commonSerivce.showError(res.message);
        }
      });
  }

  
  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }


}
