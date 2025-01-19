import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { Observable, filter, map } from 'rxjs';
import { selectUserInfo } from '../../../../store/auth/auth.selector';
import { IuserInformation } from '../../../../interfaces/userInformation';
import { NavigationEnd, Router } from '@angular/router';
import { userLogOut } from '../../../../store/auth/auth.actions';
import { ModalService } from '../../../shared/modal.service';

@Component({
  selector: 'app-teacher-navbar',
  templateUrl: './teacher-navbar.component.html',
  styleUrl: './teacher-navbar.component.css',
})
export class TeacherNavbarComponent implements OnInit {
  userInfo$!: Observable<{
    name: string;
    profilePic: { key: string; url: string };
  }>;
  navItems = [
    {
      title: 'Dashboard',
      link: './',
      icon: 'fas fa-home',
    },
    {
      title: 'Courses',
      link: 'course_manage',
      icon: 'fas fa-book',
    },
    {
      title: 'Discussions',
      link: 'discussions',
      icon: 'fas fa-comments',
    },
    { title: 'Wallet', link: 'wallet_manage', icon: 'fas fa-wallet' },
    { title: 'Payments', link: 'payment_history', icon: 'fas fa-receipt' },
    { title: 'Profile', link: 'profile_manage', icon: 'fas fa-user' },
  ];
  currentUrl = '';
  isVisibleConfirmation$ = this._modalService.isLogoutModalVisible$;

  constructor(
    private _store: Store<{ auth: AuthState }>,
    private _router: Router,
    private _modalService: ModalService
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

    if (url == 'dashboard' && !formattedLink) {
      return true;
    }

    return url === formattedLink;
  }

  confirmation(confirmed: boolean) {
    if (!confirmed) {
      this._modalService.closeLogoutModal();
    } else {
      this._modalService.closeLogoutModal();
      localStorage.clear();
      this._router.navigate(['']);
      this._store.dispatch(userLogOut());
    }
  }

  profile(){
    this._router.navigate(['teacher/profile_manage']);
  }

  logout() {
    this._modalService.openLogoutModal();
  }
}
