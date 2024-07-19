import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { RemoveTimestampPipe } from './pipes/remove-timestamp.pipe';
import { ObjectUrlPipe } from './pipes/object-url.pipe';
import { RatingStarPipe } from './pipes/rating-star.pipe';





@NgModule({
  declarations: [
    PaginationComponent,
    LoadingComponent,
    PdfViewerComponent,
    RemoveTimestampPipe,
    ObjectUrlPipe,
    RatingStarPipe,
  ],
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule
  ],
  exports:[PaginationComponent,LoadingComponent,PdfViewerComponent,ObjectUrlPipe,RemoveTimestampPipe,RatingStarPipe]
})
export class SharedModule { }
