import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
 
  declarations: [NavbarComponent, StudentHomeComponent,StudentCourseListComponent],
  imports: [CommonModule, StudentRoutingModule,FontAwesomeModule,FormsModule,ReactiveFormsModule],
})
export class AbcModule { }
