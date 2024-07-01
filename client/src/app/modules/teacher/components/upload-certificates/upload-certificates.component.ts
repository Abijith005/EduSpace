import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-certificates',
  templateUrl: './upload-certificates.component.html',
  styleUrl: './upload-certificates.component.css',
})
export class UploadCertificatesComponent {
  files: File[] = [];
  uploadProgress = 0;
  @Output() modalClosed = new EventEmitter();

  onFileSelected(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.files.push(event.dataTransfer.files[i]);
      }
    }
  }

  removeFile(file: File) {
    this.files = this.files.filter((f) => f !== file);
  }

  uploadFiles() {
    let uploaded = 0;
    const interval = setInterval(() => {
      uploaded += 10;
      this.uploadProgress = (uploaded / this.files.length) * 100;
      if (uploaded >= 100) {
        clearInterval(interval);
      }
    }, 500);
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
