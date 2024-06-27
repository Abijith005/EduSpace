import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminNavBarComponent } from './components/admin-nav-bar/admin-nav-bar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { InstructorManagementComponent } from './components/instructor-management/instructor-management.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';
import { PaymentManagemetComponent } from './components/payment-managemet/payment-managemet.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AdminNavBarComponent,
        children: [
          {path:'',redirectTo:'dashBoard',pathMatch:'full'},
          { path: 'dashBoard', component: AdminDashboardComponent },
          { path: 'category_manage', component: CategoryManagementComponent },
          { path: 'instructor_manage',component: InstructorManagementComponent },
          { path: 'student_manage', component: StudentManagementComponent },
          { path: 'payment_manage', component: PaymentManagemetComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
