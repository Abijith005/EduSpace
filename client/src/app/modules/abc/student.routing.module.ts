import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StudentCourseListComponent } from './components/student-course-list/student-course-list.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [{ path: '', component: StudentHomeComponent },
    {path:'course',component:StudentCourseListComponent}
  ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
