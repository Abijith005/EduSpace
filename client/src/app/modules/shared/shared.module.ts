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
import { SearchComponent } from './components/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { NumberConvertionPipe } from './pipes/number-convertion.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { NoDataComponent } from './components/no-data/no-data.component';

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
    SearchComponent,
    FilterComponent,
    DateRangeComponent,
    NumberConvertionPipe,
    DurationPipe,
    ConfirmationComponent,
    NoDataComponent,
  ],
  imports: [CommonModule, NgxExtendedPdfViewerModule,FormsModule,ReactiveFormsModule],
  exports: [
    PaginationComponent,
    LoadingComponent,
    PdfViewerComponent,
    ObjectUrlPipe,
    RemoveTimestampPipe,
    RatingStarPipe,
    FileNameExtractorPipe,
    MessageTimePipe,
    SearchComponent,
    FilterComponent,
    DateRangeComponent,NumberConvertionPipe,
    DurationPipe,
    ConfirmationComponent,
    NoDataComponent
  ],
})
export class SharedModule {}
