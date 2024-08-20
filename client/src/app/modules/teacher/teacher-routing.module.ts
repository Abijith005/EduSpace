import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherNavbarComponent } from './components/teacher-navbar/teacher-navbar.component';
import { TeacherDashBoardComponent } from './components/teacher-dash-board/teacher-dash-board.component';
import { TeacherProfileComponent } from './components/teacher-profile/teacher-profile.component';
import { TeacherCourseManageComponent } from './components/teacher-course-manage/teacher-course-manage.component';
import { DiscussionsComponent } from '../student/components/discussions/discussions.component';
import { TeacherWalletManageComponent } from './components/teacher-wallet-manage/teacher-wallet-manage.component';
import { TeacherPaymentHistoryComponent } from './components/teacher-payment-history/teacher-payment-history.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TeacherNavbarComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: TeacherDashBoardComponent },
          { path: 'course_manage', component: TeacherCourseManageComponent },
          { path: 'profile_manage', component: TeacherProfileComponent },
          { path: 'wallet_manage', component: TeacherWalletManageComponent },
          {
            path: 'payment_history',
            component: TeacherPaymentHistoryComponent,
          },
          { path: 'discussions', component: DiscussionsComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
