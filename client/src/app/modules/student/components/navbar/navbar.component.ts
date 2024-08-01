import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, filter, map, take, takeUntil } from 'rxjs';
import { AuthState } from '../../../../store/auth/auth.state';
import { Store } from '@ngrx/store';
import { selectUserInfo } from '../../../../store/auth/auth.selector';
import { IuserInformation } from '../../../../interfaces/userInformation';
import { NavigationEnd, Router } from '@angular/router';
import { userLogOut } from '../../../../store/auth/auth.actions';
import { SocketService } from '../../../shared/socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userInfo$!: Observable<{ name: string; profilePic: string; userId: string }>;
  currentUrl = '';
  private _ngUnsubscribe = new Subject<void>();

  navItems = [
    { title: 'Home', link: './' },
    { title: 'Courses', link: './course' },
    { title: 'Instructors', link: './payment' },
    { title: 'Discussions', link: './discussions' },
    { title: 'Subscriptions', link: './subscriptions' },
  ];

  constructor(
    private _store: Store<{ auth: AuthState }>,
    private _router: Router,
    private _socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.userInfo$ = this._store.select(selectUserInfo).pipe(
      map((userInfo: IuserInformation) => {
        return {
          name: userInfo.name,
          profilePic: userInfo.profilePic,
          userId: userInfo._id!,
        };
      })
    );

    this.currentUrl = this._router.url;

    this._router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });

    this.userInfo$
      .pipe(take(1)) // Take only the first emission
      .subscribe((userInfo) => {
        this._socketService.online(userInfo.userId);
      });
  }

  isActiveLink(link: string) {
    const url = this.currentUrl.split('/')[2];
    const formattedLink = link.replace('./', '');
    if (!url && !formattedLink) {
      return true;
    }
    return url === formattedLink;
  }

  logout() {
    this.userInfo$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((userInfo) => {
        this._socketService.offline(userInfo.userId);
      });

    localStorage.clear();
    this._store.dispatch(userLogOut());
    this._router.navigate(['']);

    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
