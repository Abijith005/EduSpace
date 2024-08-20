import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherNavbarComponent } from './components/teacher-navbar/teacher-navbar.component';
import { TeacherDashBoardComponent } from './components/teacher-dash-board/teacher-dash-board.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '../shared/shared.module';
import { TeacherProfileComponent } from './components/teacher-profile/teacher-profile.component';
import { UploadCertificatesComponent } from './components/upload-certificates/upload-certificates.component';
import { CourseUploadFormComponent } from './components/course-upload-form/course-upload-form.component';
import { TeacherCourseManageComponent } from './components/teacher-course-manage/teacher-course-manage.component';
import { TeacherUpdateCourseComponent } from './components/teacher-update-course/teacher-update-course.component';
import { FileNameExtractorPipe } from '../shared/pipes/file-name-extractor.pipe';
import { TeacherWalletWithdrawComponent } from './components/teacher-wallet-withdraw/teacher-wallet-withdraw.component';
import { TeacherWalletManageComponent } from './components/teacher-wallet-manage/teacher-wallet-manage.component';
import { TeacherPaymentHistoryComponent } from './components/teacher-payment-history/teacher-payment-history.component';
import { WithdrawUpdateComponent } from './components/withdraw-update/withdraw-update.component';

@NgModule({
  declarations: [
    TeacherNavbarComponent,
    TeacherDashBoardComponent,
    TeacherCourseManageComponent,
    TeacherProfileComponent,
    UploadCertificatesComponent,
    CourseUploadFormComponent,
    TeacherUpdateCourseComponent,
    TeacherWalletWithdrawComponent,
    TeacherWalletManageComponent,
    TeacherPaymentHistoryComponent,
    WithdrawUpdateComponent,
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    SharedModule,
  ],
  providers: [FileNameExtractorPipe],
})
export class TeacherModule {}
