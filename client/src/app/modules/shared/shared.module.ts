import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { RemoveTimestampPipe } from './pipes/remove-timestamp.pipe';
import { ObjectUrlPipe } from './pipes/object-url.pipe';
import { RatingStarPipe } from './pipes/rating-star.pipe';
import { FileNameExtractorPipe } from './pipes/file-name-extractor.pipe';
import { MessageTimePipe } from './pipes/message-time.pipe';
import { MessageDatePipe } from './pipes/message-date.pipe';

@NgModule({
  declarations: [
    PaginationComponent,
    LoadingComponent,
    PdfViewerComponent,
    RemoveTimestampPipe,
    ObjectUrlPipe,
    RatingStarPipe,
    FileNameExtractorPipe,
    MessageTimePipe,
    MessageDatePipe,
  ],
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  exports: [
    PaginationComponent,
    LoadingComponent,
    PdfViewerComponent,
    ObjectUrlPipe,
    RemoveTimestampPipe,
    RatingStarPipe,
    FileNameExtractorPipe,
    MessageTimePipe,
  ],
})
export class SharedModule {}
