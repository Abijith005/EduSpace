import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { StudentRoutingModule } from './student.routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StudentCourseListComponent } from './components/student-course-list/student-course-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NavbarComponent, StudentHomeComponent,StudentCourseListComponent],
  imports: [CommonModule, StudentRoutingModule,FontAwesomeModule,FormsModule,ReactiveFormsModule],
})
export class StudentModule {}
