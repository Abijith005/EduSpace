import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { StudentRoutingModule } from './student.routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StudentCourseListComponent } from './components/student-course-list/student-course-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { SharedModule } from '../shared/shared.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { StudentCourseViewComponent } from './components/student-course-view/student-course-view.component';
import { StudentViewReviewComponent } from './components/student-view-review/student-view-review.component';
import { StudentAboutCourseComponent } from './components/student-about-course/student-about-course.component';
import { PaymentComponent } from './components/payment/payment.component';
import { StudentSubscriptionComponent } from './components/student-subscription/student-subscription.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { CourseComponent } from './components/discussions/course/course.component';
import { ChatGptComponent } from './components/chat-gpt/chat-gpt.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { NotesComponent } from './components/notes/notes.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DiscussionsComponent } from './components/discussions/discussions.component';
import { MeetingComponent } from '../shared/components/meeting/meeting.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { RatingComponent } from './components/rating/rating.component';

@NgModule({
  declarations: [
    NavbarComponent,
    StudentHomeComponent,
    StudentCourseListComponent,
    FilterComponent,
    StudentCourseViewComponent,
    StudentViewReviewComponent,
    StudentAboutCourseComponent,
    PaymentComponent,
    StudentSubscriptionComponent,
    PaymentSuccessComponent,
    CourseComponent,
    ChatGptComponent,
    LessonsComponent,
    NotesComponent,
    DiscussionsComponent,
    MeetingComponent,
    StudentProfileComponent,
    RatingComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSliderModule,
    NgxExtendedPdfViewerModule,
  ],
})
export class StudentModule {}
