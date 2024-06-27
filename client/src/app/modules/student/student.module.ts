import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { StudentRoutingModule } from './student.routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [NavbarComponent, StudentHomeComponent],
  imports: [CommonModule, StudentRoutingModule,FontAwesomeModule],
})
export class StudentModule {}
