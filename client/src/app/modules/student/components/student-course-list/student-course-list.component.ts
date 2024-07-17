import { Component } from '@angular/core';
import { StudentService } from '../../student.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-student-course-list',
  templateUrl: './student-course-list.component.html',
  styleUrl: './student-course-list.component.css',
})
export class StudentCourseListComponent {
  totalPages: number = 10;
  currentPage = 1;
  search = '';
  filter = '';
  limit = 6;
  maxValue: number = 200;
  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 200,
    step: 50,
    noSwitching: true,
    translate: (value: number): string => {
      return '₹' + value;
    }
  };

  constructor(private _studentService: StudentService ,) {
    
  }

  getAllCourses() {
    
    this._studentService
      .getAllCourses(this.currentPage, this.limit, this.search, this.filter)
      .subscribe((res) => {
        console.log(res);
      });
  }

  courseCategories = [
    { name: 'Commercial', count: 15, selected: false },
    { name: 'Office', count: 15, selected: false },
    { name: 'Shop', count: 15, selected: true },
    { name: 'Educate', count: 15, selected: false },
    { name: 'Academy', count: 15, selected: true },
    { name: 'Single family home', count: 15, selected: false },
    { name: 'Studio', count: 15, selected: false },
    { name: 'University', count: 15, selected: false },
  ];

  instructors = [
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'John Doe', count: 15, selected: false },
  ];

  prices = [
    { name: 'All', count: 15, selected: true },
    { name: 'Free', count: 15, selected: false },
    { name: 'Paid', count: 15, selected: false },
  ];

  reviews = [
    { stars: [1, 1, 1, 1, 1], emptyStars: [], count: 1025, selected: false },
    { stars: [1, 1, 1, 1], emptyStars: [1], count: 1025, selected: true },
    { stars: [1, 1, 1], emptyStars: [1, 1], count: 1025, selected: false },
    { stars: [1, 1], emptyStars: [1, 1, 1], count: 1025, selected: false },
    { stars: [1], emptyStars: [1, 1, 1, 1], count: 1025, selected: false },
  ];



  onPageChanged(page: number) {
    console.log(this.maxValue,this.value);

    this.currentPage = page;
    // this.getAllCourses();
  }
}
