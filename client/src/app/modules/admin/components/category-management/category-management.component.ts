import { Component } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
interface Category {
  name: string;
  instructors: number;
  students: number;
  courses: number;
  icon: string;
  status: string;
}
@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css',
})
export class CategoryManagementComponent {
  isVisible$ = this._modalService.isVisible$;
  totalPages = 10;
  currentPage = 1;
  categories: Category[] = [
    {
      name: 'Photography',
      instructors: 117,
      students: 100,
      courses: 100,
      icon: '📷',
      status: 'Active',
    },
    {
      name: 'Videography',
      instructors: 10,
      students: 100,
      courses: 100,
      icon: '🎥',
      status: 'Blocked',
    },
    {
      name: 'Web Design',
      instructors: 15,
      students: 77,
      courses: 77,
      icon: '💻',
      status: 'Blocked',
    },
    {
      name: 'Digital Marketing',
      instructors: 7,
      students: 6,
      courses: 6,
      icon: '📈',
      status: 'Active',
    },
    {
      name: 'Jerome Bell',
      instructors: 20,
      students: 85,
      courses: 85,
      icon: '👨‍🏫',
      status: 'Active',
    },
    {
      name: 'Kathryn Murphy',
      instructors: 3,
      students: 12,
      courses: 12,
      icon: '👩‍🏫',
      status: 'Active',
    },
    {
      name: 'Jacob Jones',
      instructors: 0,
      students: 0,
      courses: 0,
      icon: '👨‍🏫',
      status: 'Active',
    },
    {
      name: 'Kristin Watson',
      instructors: 50,
      students: 7,
      courses: 7,
      icon: '👩‍🏫',
      status: 'Blocked',
    },
  ];

  constructor(private _modalService: ModalService) {}

  openModal() {
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
