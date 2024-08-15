import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectUserInfo } from '../../../../store/auth/auth.selector';
import { Subject, takeUntil } from 'rxjs';
import { ToasterService } from '../../../shared/toaster.service';
import { StudentService } from '../../../student/student.service';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrl: './teacher-profile.component.css',
})
export class TeacherProfileComponent implements OnInit {
  userName!: string;
  profilePic: { key: string; url: string } | null = null;
  email!: string;
  updatedName: string | null = null;
  updatedPassword: string | null = null;
  confirmPassword: string | null = null;
  oldPassword: string | null = null;
  updatedProfilePic: File | null = null;

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _modalService: ModalService,
    private _store: Store<{ user: AuthState }>,
    private _toasterService: ToasterService,
    private _studentService: StudentService
  ) {}
  isVisible$ = this._modalService.isVisible$;

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

  openModal() {
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.updatedProfilePic = file;
    }
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
      .updatePassword(this.oldPassword, this.updatedPassword, this.email)
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
}
