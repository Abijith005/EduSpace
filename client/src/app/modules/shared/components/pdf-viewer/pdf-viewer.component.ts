import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css',
})
export class PdfViewerComponent implements OnInit {
  @Input() certificate!: string;
  @Output() pdfModalClosed = new EventEmitter();

  ngOnInit(): void {
    console.log(this.certificate);
  }
  closeModal() {
    this.pdfModalClosed.emit();
  }
}
