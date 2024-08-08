import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectUserAuthState } from '../../../../store/auth/auth.selector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudentService } from '../../student.service';
import { ToasterService } from '../../../shared/toaster.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
})
export class StudentProfileComponent implements OnInit, OnDestroy {
  userName!: string;
  profilePic: string | null = null;
  email!: string;
  updatedProfilePic: File | null = null;
  updatedName: string | null = null;
  updatedPassword: string | null = null;
  confirmPassword: string | null = null;
  private timer!: any;
  private ngUnsubscribe$ = new Subject<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<{ user: AuthState }>,
    private studentService: StudentService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectUserAuthState)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.userName = res.userData.name;
        this.profilePic = res.userData.profilePic;
        this.email = res.userData.email;
      });
  }

  onNameChange(event: Event): void {
    clearTimeout(this.timer);
    const target = event.target as HTMLInputElement;

    this.timer = setTimeout(() => {
      if (target.value) {
        this.updatedName = target.value;
      }
    }, 300);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.updatedProfilePic = file;
    }
  }

  changeUserProfile(): void {
    const data = new FormData();
    if (this.updatedProfilePic) {
      data.append('profilePic', this.updatedProfilePic);
    }

    if (this.updatedName) {
      data.append('name', this.updatedName);
    }

    if (data.has('profilePic') || data.has('name')) {
      this.updateProfile(data);
    }
  }

  changePassword(): void {
    if (!this.updatedPassword) {
      return;
    }
    if (this.updatedPassword !== this.confirmPassword) {
      this.toasterService.showError('Password not matching');
      return;
    }
    const data = new FormData();
    data.append('password', this.updatedPassword);

    this.updateProfile(data);
  }

  private updateProfile(data: FormData): void {
    this.studentService
      .updateUserInfo(data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.toasterService.toasterFunction(res);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
