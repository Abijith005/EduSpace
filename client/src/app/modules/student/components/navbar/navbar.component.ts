import { Component } from '@angular/core';
import { Observable, Subject, filter, map } from 'rxjs';
import { AuthState } from '../../../../store/auth/auth.state';
import { Store } from '@ngrx/store';
import { selectUserInfo } from '../../../../store/auth/auth.selector';
import { IuserInformation } from '../../../../interfaces/userInformation';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  userInfo$!: Observable<{ name: string; profilePic: string }>;
  currentUrl = '';
  navItems = [
    { title: 'Home', link: './' },
    { title: 'Courses', link: './course' },
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

    this.currentUrl = this._router.url;

    this._router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
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
    localStorage.clear();
    this._router.navigate(['../']);
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
