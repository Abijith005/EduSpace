import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'auth'},

  {path:'auth',loadChildren:()=>import('./modules/teacher/teacher.module').then(module=>module.TeacherModule)},
  
  { path: 'student', loadChildren: () => import('./modules/student/student.module').then(module => module.StudentModule) },

  {path:"admin",loadChildren:()=> import ('./modules/admin/admin.module').then(module=>module.AdminModule)},

  {path:"teacher", loadChildren:()=>import('./modules/teacher/teacher.module').then(module=>module.TeacherModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
