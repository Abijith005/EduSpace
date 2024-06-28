import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-navbar',
  templateUrl: './teacher-navbar.component.html',
  styleUrl: './teacher-navbar.component.css'
})
export class TeacherNavbarComponent {
  selectedItem=0


  selectItem(index: number) {
    this.selectedItem = index;
  }

  
}
