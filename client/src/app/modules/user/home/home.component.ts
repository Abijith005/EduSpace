import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private _userService:UserService ){}

  test(){
    this._userService.test().subscribe(res=>{
      
    })
  }
}
