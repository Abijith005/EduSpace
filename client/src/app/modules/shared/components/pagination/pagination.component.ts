import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Output() pageChanged = new EventEmitter<number>();
  pages: number[] = [];

  ngOnChanges() {
    console.log(this.pages);
    
    this.updatePages();
  }

  updatePages() {
    const startPage = Math.max(1, this.currentPage - 1);
    const endPage = Math.min(this.totalPages, startPage + 2);

    this.pages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage);
      this.updatePages();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
