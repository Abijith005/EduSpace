import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminNavBarComponent } from './components/admin-nav-bar/admin-nav-bar.component';



@NgModule({
  declarations: [
    AdminNavBarComponent
  ],
  imports: [
    CommonModule,AdminRoutingModule
  ]
})
export class AdminModule { }
