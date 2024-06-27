import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'auth'},

  {path:'auth',loadChildren:()=>import('./modules/auth/auth.module').then(module=>module.AuthModule)},
  
  { path: 'student', loadChildren: () => import('./modules/student/student.module').then(module => module.StudentModule) },

  {path:"admin",loadChildren:()=> import ('./modules/admin/admin.module').then(module=>module.AdminModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
