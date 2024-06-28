import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherNavbarComponent } from './components/teacher-navbar/teacher-navbar.component';
import { TeacherDashBoardComponent } from './components/teacher-dash-board/teacher-dash-board.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
  declarations: [
    TeacherNavbarComponent,
    TeacherDashBoardComponent
  ],
  imports: [
    CommonModule,TeacherRoutingModule,FormsModule,ReactiveFormsModule,NgApexchartsModule
  ]
})
export class TeacherModule { }
