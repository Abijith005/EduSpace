import { Component } from '@angular/core';
import { faCoffee, faVideo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent {

 

  scrollTop(){
    window.scroll({
      top:0,
      left:0,
      behavior:"smooth"
    })
  }
}
