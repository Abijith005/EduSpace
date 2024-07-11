import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';





@NgModule({
  declarations: [
    PaginationComponent,
    LoadingComponent,
    PdfViewerComponent,
  ],
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule
  ],
  exports:[PaginationComponent,LoadingComponent,PdfViewerComponent,]
})
export class SharedModule { }
