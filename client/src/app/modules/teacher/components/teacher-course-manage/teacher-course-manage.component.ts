import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-course-manage',
  templateUrl: './teacher-course-manage.component.html',
  styleUrl: './teacher-course-manage.component.css'
})
export class TeacherCourseManageComponent {
  totalPages = 10;
  currentPage = 1;

  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
