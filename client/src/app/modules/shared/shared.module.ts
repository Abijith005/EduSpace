import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';
import { LoadingComponent } from './components/loading/loading.component';



@NgModule({
  declarations: [
    PaginationComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule
  ],
  exports:[PaginationComponent]
})
export class SharedModule { }
