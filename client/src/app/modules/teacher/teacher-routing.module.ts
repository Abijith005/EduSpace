import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherNavbarComponent } from './components/teacher-navbar/teacher-navbar.component';
import { TeacherDashBoardComponent } from './components/teacher-dash-board/teacher-dash-board.component';
import { TeacherProfileComponent } from './components/teacher-profile/teacher-profile.component';
import { TeacherCourseManageComponent } from './components/teacher-course-manage/teacher-course-manage.component';
import { TeacherPaymentComponent } from './components/teacher-payment/teacher-payment.component';

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
          {path:'payment_manage',component:TeacherPaymentComponent}
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
