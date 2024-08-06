import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { studentModuleGuard } from './guards/student-module.guard';
import { authModuleGuard } from './guards/auth-module.guard';
import { adminModuleGuard } from './guards/admin-module.guard';
import { teacherModuleGuard } from './guards/teacher-module.guard';
import { MeetingComponent } from './modules/shared/components/meeting/meeting.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  // { path: 'hi', component: MeetingComponent },

  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((module) => module.AuthModule),
    canActivate: [authModuleGuard],
  },

  {
    path: 'student',
    loadChildren: () =>
      import('./modules/student/student.module').then(
        (module) => module.StudentModule
      ),
    canActivate: [studentModuleGuard],
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(
        (module) => module.AdminModule
      ),
    canActivate: [adminModuleGuard],
  },

  {
    path: 'teacher',
    loadChildren: () =>
      import('./modules/teacher/teacher.module').then(
        (module) => module.TeacherModule
      ),
    canActivate: [teacherModuleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
