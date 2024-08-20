import { Component, EventEmitter, Output } from '@angular/core';
import { DateRangePicker } from 'flowbite-datepicker';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrl: './date-range.component.css',
})
export class DateRangeComponent {
  @Output() applyDateRange = new EventEmitter<{
    startDate: string;
    endDate: string;
  }>();
  startDate: string = '';
  endDate: string = '';

  private dateRangePicker!: DateRangePicker;

  ngAfterViewInit(): void {
    this.initializeDatePicker();
  }

  initializeDatePicker() {
    const dateRangePickerElement = document.getElementById('date-range-picker');
    if (dateRangePickerElement) {
      this.dateRangePicker = new DateRangePicker(dateRangePickerElement, {});
    }
  }

  onDateChange() {
    const selectedDates = this.dateRangePicker.getDates();

    if (
      Array.isArray(selectedDates) &&
      selectedDates.length === 2 &&
      selectedDates.every((date) => !isNaN(new Date(date).getTime()))
    ) {
      this.startDate = this.formatDate(selectedDates[0]);
      this.endDate = this.formatDate(selectedDates[1]);
    } else {
      this.startDate = '';
      this.endDate = '';
    }
    this.applyChange();
  }

  applyChange() {
    this.applyDateRange.emit({
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  }
}
