import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthState } from '../../../../store/auth/auth.state';
import { Store } from '@ngrx/store';
import { userLogOut } from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-admin-nav-bar',
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css'],
})
export class AdminNavBarComponent implements OnInit {
  currentUrl = '';
  navItems = [
    {
      title: 'Dashboard',
      link: './',
      icon: 'fas fa-home',
    },
    {
      title: 'Instructors',
      link: 'instructor_manage',
      icon: 'fas fa-user-graduate',
    },
    {
      title: 'Students',
      link: 'student_manage',
      icon: 'fas fa-graduation-cap',
    },
    { title: 'Categories', link: 'category_manage', icon: 'fas fa-list-alt' },
    { title: 'Permissions', link: 'permission_manage', icon: 'fas fa-key' },
    { title: 'Payments', link: 'payment_manage', icon: 'fas fa-credit-card' },
  ];

  constructor(
    private _router: Router,
    private _store: Store<{ auth: AuthState }>
  ) {}

  ngOnInit(): void {
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

    if (url == 'dashBoard' && !formattedLink) {
      return true;
    }

    return url === formattedLink;
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['']);
    this._store.dispatch(userLogOut());
  }
}
