import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherNavbarComponent } from './components/teacher-navbar/teacher-navbar.component';

const routes: Routes = [
 {path:'',children:[
    {path:'',component:TeacherNavbarComponent,children:[
        
    ]}
 ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
