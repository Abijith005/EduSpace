import { Component } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { AuthState } from '../../../../store/auth/auth.state';
import { Store } from '@ngrx/store';
import { selectUserInfo } from '../../../../store/auth/auth.selector';
import { IuserInformation } from '../../../../interfaces/userInformation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  userInfo$!: Observable<{ name: string; profilePic: string }>;
  navItems = [
    { title: 'Home', link: './' },
    { title: 'Courses', link: './courses' },
    { title: 'Instructors', link: './instructors' },
    { title: 'Discussions', link: './discussions' },
    { title: 'Subscriptions', link: './subscriptions' },
  ];

  private _ngUnsubscribe = new Subject<void>();

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
    this._router.navigate(['../']);
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
