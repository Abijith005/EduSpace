import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-nav-bar',
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css']
})
export class AdminNavBarComponent {
  selectedItem=0


  selectItem(index: number) {
    this.selectedItem = index;
  }
}
