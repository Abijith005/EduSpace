import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminNavBarComponent } from './components/admin-nav-bar/admin-nav-bar.component';
import { CategoryComponent } from './components/category/category.component';
import { SharedModule } from '../shared/shared.module';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NgApexchartsModule } from "ng-apexcharts";




@NgModule({
  declarations: [ 
    AdminNavBarComponent,
    CategoryComponent,
    AddCategoryComponent,
    AdminDashboardComponent,
    
  ],
  imports: [
    CommonModule,AdminRoutingModule,SharedModule,NgApexchartsModule
  ]
})
export class AdminModule { }
