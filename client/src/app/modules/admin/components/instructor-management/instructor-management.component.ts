import { Component } from '@angular/core';

@Component({
  selector: 'app-instructor-management',
  templateUrl: './instructor-management.component.html',
  styleUrl: './instructor-management.component.css'
})
export class InstructorManagementComponent {
  totalPages = 10;
  currentPage = 1;

  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
