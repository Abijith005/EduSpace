import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherNavbarComponent } from './components/teacher-navbar/teacher-navbar.component';
import { TeacherDashBoardComponent } from './components/teacher-dash-board/teacher-dash-board.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TeacherCourseManageComponent } from './components/teacher-course-manage/teacher-course-manage.component';
import { SharedModule } from '../shared/shared.module';
import { TeacherProfileComponent } from './components/teacher-profile/teacher-profile.component';
import { UploadCertificatesComponent } from './components/upload-certificates/upload-certificates.component';
import { TeacherPaymentComponent } from './components/teacher-payment/teacher-payment.component';



@NgModule({
  declarations: [
    TeacherNavbarComponent,
    TeacherDashBoardComponent,
    TeacherCourseManageComponent,
    TeacherProfileComponent,
    UploadCertificatesComponent,
    TeacherPaymentComponent
  ],
  imports: [
    CommonModule,TeacherRoutingModule,FormsModule,ReactiveFormsModule,NgApexchartsModule,SharedModule
  ]
})
export class TeacherModule { }
