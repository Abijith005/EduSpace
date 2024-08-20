import { Options } from '@angular-slider/ngx-slider';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { StudentService } from '../../student.service';
import { Subject, takeUntil } from 'rxjs';
import { IfilterSelectionItems } from '../../../../interfaces/filterSelectionList';

interface filterValues {
  searchKey: string;
  category_ids: string[];
  instructor_ids: string[];
  ratingRange: { min: number; max: number };
  priceRange: { min: number; max: number };
}
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit, OnDestroy {
  @Output() onApplyFilter = new EventEmitter<filterValues>();
  @Input() selectedCategoryId: string | null = null;

  searchKey = '';
  searchInstructor = '';
  instructorList!: IfilterSelectionItems[];
  courseCategories!: IfilterSelectionItems[];
  instructors!: IfilterSelectionItems[];
  ratings!: IfilterSelectionItems[];
  priceRange = { min: 0, max: 0 };
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
  constructor(
    private _studentService: StudentService,
    private _cdRef: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.getFilterDatas();
  }

  getFilterDatas() {
    this._studentService
      .getAllFilterDatas()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        const categoryData = res.data.categoryData;
        this.courseCategories = categoryData.map((item) => {
          let selected = false;
          if (item._id == this.selectedCategoryId) {
            selected = true;
          }
          return {
            ...item,
            selected,
          };
        });

        const ratingsData = res.data.ratingData;

        this.ratings = ratingsData.map((item) => ({
          ...item,
          selected: false,
        }));

        const instructorsData = res.data.instructorData;
        this.instructors = instructorsData.map((item) => ({
          ...item,
          selected: false,
        }));
        this.instructorList = this.instructors;

        this.updateSliderOptions(res.data.priceRange.maxPrice);
      });
  }

  updateSliderOptions(maxPrice: number) {
    this.priceRange.max = maxPrice;
    this._ngZone.run(() => {
      this.options = {
        ...this.options,
        ceil: maxPrice,
      };
      this._cdRef.detectChanges();
    });
  }

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
    const keys = this.searchInstructor.split(' ');
    this.timer = setTimeout(() => {
      this.instructorList = this.instructors.filter((item: any) => {
        return keys.some((keyword) => {
          const regex = new RegExp(keyword, 'i');
          return regex.test(item.name);
        });
      });

      this.instructorList.sort((a, b) =>
        a.selected === b.selected ? 0 : a.selected ? -1 : 1
      );
    }, 300);
  }

  searchFucntion() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (!this.searchKey.trim()) {
        this.applyFilter();
      }
    }, 300);
  }

  applyFilter() {
    const category_ids = this.courseCategories
      .filter((item) => item.selected)
      .map((item) => item._id!);
    const instructor_ids = this.instructors
      .filter((item) => item.selected)
      .map((item) => item._id!);

    const ratingRange = this.ratings.reduce(
      (acc, value) => {
        if (value.selected) {
          const rating = value.rating ?? 0;
          return {
            min: Math.min(acc.min, rating),
            max: Math.max(acc.max, rating),
          };
        }
        return acc;
      },
      { min: Infinity, max: -Infinity }
    );

    const finalRatingRange = {
      min: ratingRange.min === Infinity ? 0 : ratingRange.min,
      max: ratingRange.max === -Infinity ? 5 : ratingRange.max,
    };

    this.onApplyFilter.emit({
      searchKey: this.searchKey,
      category_ids: category_ids,
      instructor_ids: instructor_ids,
      ratingRange: finalRatingRange,
      priceRange: this.priceRange,
    });
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
