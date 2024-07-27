import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../student.service';
import { IcourseDetails } from '../../../../interfaces/courseDetails';
import { Subject, takeUntil } from 'rxjs';
import { IfilterValues } from '../../../../interfaces/filterValues';

@Component({
  selector: 'app-student-course-list',
  templateUrl: './student-course-list.component.html',
  styleUrl: './student-course-list.component.css',
})
export class StudentCourseListComponent implements OnInit {
  totalPages: number = 10;
  currentPage = 1;
  searchKey = '';
  filter: IfilterValues = {
    searchKey: '',
    category_ids: [],
    instructor_ids: [],
    ratingRange: { min: null, max: null },
    priceRange: { min: null, max: null },
  };
  limit = 6;
  courses!: IcourseDetails[];

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(private _studentService: StudentService) {}

  ngOnInit(): void {
    this.getAllCourses();
  }

  getAllCourses() {
    this._studentService
      .getAllCourses(this.currentPage, this.limit, this.searchKey, this.filter)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.courses = res.courses;
        this.totalPages = res.totalPages;
      });
  }

  onApplyFilter(filterDatas: IfilterValues) {
    this.filter = filterDatas;
    
    this.searchKey = filterDatas.searchKey;

    this.getAllCourses();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.getAllCourses();
  }
}
