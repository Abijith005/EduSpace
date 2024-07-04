import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectUserInfo } from '../../../../store/auth/auth.selector';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent{


 

  scrollTop(){
    window.scroll({
      top:0,
      left:0,
      behavior:"smooth"
    })
  }
}
