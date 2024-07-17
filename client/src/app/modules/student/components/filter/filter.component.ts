import { Options } from '@angular-slider/ngx-slider';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentService } from '../../student.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit, OnDestroy {
  searchKey = '';
  searchInstructor = '';
  instructorList!: { name: string; count: number; selected: boolean }[];
  courseCategories!: { title: string; count: number; selected: boolean }[];
  maxValue: number = 2000;
  value: number = 0;
  timer: any;
  options: Options = {
    floor: 0,
    ceil: 2000,
    step: 50,
    noSwitching: true,
    translate: (value: number): string => {
      return '₹' + value;
    },
  };

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(private _studentService: StudentService) {}

  ngOnInit(): void {
    this.instructorList = this.instructors;
    this._studentService
      .getAllCategoriesCourseCount()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        const data = res.data;
        this.courseCategories = data.map((item) => ({
          ...item,
          selected: false,
        }));
      });
  }
  // courseCategories = [
  //   { name: 'Commercial', count: 15, selected: false },
  //   { name: 'Office', count: 15, selected: false },
  //   { name: 'Shop', count: 15, selected: false },
  //   { name: 'Educate', count: 15, selected: false },
  //   { name: 'Academy', count: 15, selected: false },
  //   { name: 'Single family home', count: 15, selected: false },
  //   { name: 'Studio', count: 15, selected: false },
  //   { name: 'University', count: 15, selected: false },
  // ];

  instructors = [
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'Kenny White', count: 15, selected: false },
    { name: 'John Doe', count: 15, selected: false },
  ];

  reviews = [
    { stars: [1, 1, 1, 1, 1], emptyStars: [], count: 1025, selected: false },
    { stars: [1, 1, 1, 1], emptyStars: [1], count: 1025, selected: false },
    { stars: [1, 1, 1], emptyStars: [1, 1], count: 1025, selected: false },
    { stars: [1, 1], emptyStars: [1, 1, 1], count: 1025, selected: false },
    { stars: [1], emptyStars: [1, 1, 1, 1], count: 1025, selected: false },
  ];

  selected(list: string, index: number) {
    const listArray = this[list as keyof this] as Array<{
      name: string;
      count: number;
      selected: boolean;
    }>;

    for (let i = 0; i < listArray.length; i++) {
      const value = listArray[index].selected;
      if (listArray[i].selected === false) {
        const item = listArray.splice(index, 1);
        if (value) {
          listArray.splice(i - 1, 0, ...item);
        } else {
          listArray.splice(i, 0, ...item);
        }
        break;
      }
    }
  }

  instructorSearch() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      console.log(keys);

      this.instructorList = this.instructors.filter((item) => {
        return keys.some((keyword) => {
          const regex = new RegExp(keyword, 'i');
          return regex.test(item.name);
        });
      });
    }, 300);
    const keys = this.searchInstructor.split(' ');
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
