import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StudentCourseListComponent } from './components/student-course-list/student-course-list.component';
import { StudentCourseViewComponent } from './components/student-course-view/student-course-view.component';
import { StudentAboutCourseComponent } from './components/student-about-course/student-about-course.component';
import { StudentViewReviewComponent } from './components/student-view-review/student-view-review.component';
import { PaymentComponent } from './components/payment/payment.component';
import { StudentSubscriptionComponent } from './components/student-subscription/student-subscription.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [{ path: '', component: StudentHomeComponent },
    {path:'course',component:StudentCourseListComponent},
    {path:'course/view/:id',component:StudentCourseViewComponent,children:[
      {path:'',redirectTo:'about',pathMatch:'full'},
      {path:'about',component:StudentAboutCourseComponent},
      {path:'reviews',component:StudentViewReviewComponent}
    ]},
    {path:'subscriptions',component:StudentSubscriptionComponent}
  ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
