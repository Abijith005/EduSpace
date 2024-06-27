import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminNavBarComponent } from './components/admin-nav-bar/admin-nav-bar.component';
import { SharedModule } from '../shared/shared.module';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { InstructorManagementComponent } from './components/instructor-management/instructor-management.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { PaymentManagemetComponent } from './components/payment-managemet/payment-managemet.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';




@NgModule({
  declarations: [ 
    AdminNavBarComponent,
    AddCategoryComponent,
    AdminDashboardComponent,
    InstructorManagementComponent,
    CategoryManagementComponent,
    PaymentManagemetComponent,
    StudentManagementComponent,
    
  ],
  imports: [
    CommonModule,AdminRoutingModule,SharedModule,NgApexchartsModule
  ]
})
export class AdminModule { }
