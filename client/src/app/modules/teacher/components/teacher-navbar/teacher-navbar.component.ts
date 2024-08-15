import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { Observable, map } from 'rxjs';
import { selectUserInfo } from '../../../../store/auth/auth.selector';
import { IuserInformation } from '../../../../interfaces/userInformation';
import { Router } from '@angular/router';
import { userLogOut } from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-teacher-navbar',
  templateUrl: './teacher-navbar.component.html',
  styleUrl: './teacher-navbar.component.css',
})
export class TeacherNavbarComponent implements OnInit {
  selectedItem = 0;
  userInfo$!: Observable<{ name: string; profilePic: {key:string,url:string} }>;

  constructor(
    private _store: Store<{ auth: AuthState }>,
    private _router: Router
  ) {}
  ngOnInit(): void {
    this.userInfo$ = this._store.select(selectUserInfo).pipe(
      map((userInfo: IuserInformation) => ({
        name: userInfo.name,
        profilePic: userInfo.profilePic,
      }))
    );
  }

  logout() {
    localStorage.clear();
    this._router.navigate(['']);
    this._store.dispatch(userLogOut());
  }
  selectItem(index: number) {
    this.selectedItem = index;
  }
}
