import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {path:'',pathMatch:'full',redirectTo:'auth'},

  {path:'auth',loadChildren:()=>import('./modules/auth/auth.module').then(module=>module.AuthModule)},

  {path:'home',loadChildren:()=>import('./modules/user/user.module').then(module=>module.UserModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
