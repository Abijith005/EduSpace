import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();
  searchKey: string = '';
  previousSearchKey: string = '';
  timer: any;

  onSearch() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (
        this.searchKey.trim() !== '' ||
        (this.searchKey.trim() === '' && this.previousSearchKey.trim() !== '')
      ) {
        const formattedKeyWord = this.escapeSpecialChars(this.searchKey);
        this.search.emit(formattedKeyWord.trim());
      }

      this.previousSearchKey = this.searchKey;
    }, 300);
  }

  escapeSpecialChars(input: string) {
    const key = input.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    return key.trim();
  }
}
