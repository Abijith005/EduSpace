import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import {
  selectUserInfo,
} from '../../../../store/auth/auth.selector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudentService } from '../../student.service';
import { ToasterService } from '../../../shared/toaster.service';
import { infoUpdate } from '../../../../store/auth/auth.actions';

interface updatedUserInfo {
  profilePic?: { key: string; url: string };
  name?: string;
}

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
})
export class StudentProfileComponent implements OnInit, OnDestroy {
  userName!: string;
  profilePic: { key: string; url: string } | null = null;
  email!: string;
  updatedProfilePic: File | null = null;
  updatedName: string | null = null;
  updatedPassword: string | null = null;
  confirmPassword: string | null = null;
  oldPassword: string | null = null;
  private timer!: any;
  private _ngUnsubscribe$ = new Subject<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private _store: Store<{ user: AuthState }>,
    private _studentService: StudentService,
    private _toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this._store
      .select(selectUserInfo)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.userName = res.name;
        this.profilePic = res.profilePic;
        this.email = res.email;
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
    if (!this.updatedProfilePic && !this.updatedName) {
      this._toasterService.showError('Please change the data');
      return;
    }
    const data = new FormData();

    if (this.updatedProfilePic) {
      data.append('profilePic', this.updatedProfilePic);
      data.append('deletedFile', this.profilePic?.key!);
    }

    if (this.updatedName) {
      data.append('name', this.updatedName);
    }

    this.updateProfile(data);
  }

  changePassword(): void {
    console.log(this.updatedPassword, this.confirmPassword, this.oldPassword);

    if (!this.updatedPassword || !this.oldPassword || !this.confirmPassword) {
      this._toasterService.showError('Fill all the Fields');
      return;
    }
    if (this.updatedPassword !== this.confirmPassword) {
      this._toasterService.showError('Password not matching');
      this.clearPasswords();
      return;
    }
    const passwordPattern = /^.{4,}$/;
    console.log(passwordPattern.test(this.updatedPassword), 'asdfghjk');

    if (!passwordPattern.test(this.updatedPassword)) {
      this._toasterService.showError('Password contain min 4 charactors');
      this.clearPasswords();
      return;
    }

    this._studentService
      .updatePassword(this.oldPassword,this.updatedPassword, this.email)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this._toasterService.toasterFunction(res);
      });
  }
  clearPasswords() {
    this.updatedPassword = null;
    this.confirmPassword = null;
    this.oldPassword = null;
  }

  private updateProfile(data: FormData): void {
    this._studentService
      .updateUserInfo(data)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        if (res.success) {
          const updatedData: Partial<updatedUserInfo> = {};
          if (this.updatedName) {
            updatedData['name'] = this.updatedName;
          }

          if (this.updatedProfilePic) {
            updatedData.profilePic = res.profilePic;
          }
          this._store.dispatch(infoUpdate({ updatedData: updatedData }));
          this.updatedProfilePic = null;
        }
        this.clearPasswords();
        this._toasterService.toasterFunction(res);
      });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
