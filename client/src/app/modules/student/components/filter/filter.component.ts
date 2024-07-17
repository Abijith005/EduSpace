import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  searchKey = '';
  searchInstructor = '';
  instructorList!: { name: string; count: number; selected: boolean }[];
  maxValue: number = 2000;
  value: number = 0;
  timer:any
  options: Options = {
    floor: 0,
    ceil: 2000,
    step: 50,
    noSwitching: true,
    translate: (value: number): string => {
      return '₹' + value;
    },
  };

  ngOnInit(): void {
    this.instructorList = this.instructors;
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
}
