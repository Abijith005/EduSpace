import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  role: string = '';
  isSubmitted: boolean = false;
  passwordVisibilty: boolean = false;
  loginForm: FormGroup = new FormGroup({});

  private _ngUnsbscribe = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _ngToaster: NgToastService
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
    data.role = this.role;

    this._authService
      .login(data)
      .pipe(takeUntil(this._ngUnsbscribe))
      .subscribe((res) => {
        console.log(res);
      });
  }
}
