import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  @Input() filterValues!: string[];
  @Output() filterAction = new EventEmitter<string>();
  allowedFilterValues!: string[];
  filter: string = '';

  ngOnInit(): void {
    this.allowedFilterValues = ['', ...this.filterValues];
  }

  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    let selectedValue = selectElement.value;

    selectedValue = selectedValue.replace(/"/g, '').trim();

    if (!this.allowedFilterValues.includes(selectedValue)) {
      return;
    }

    this.applyFilter(selectedValue);
  }

  applyFilter(filter: string) {
    this.filterAction.emit(filter);
  }
}
