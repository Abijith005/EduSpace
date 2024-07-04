import { Component, EventEmitter, Output } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ToasterService } from '../../../shared/toaster.service';
import { TeacherService } from '../../teacher.service';

@Component({
  selector: 'app-upload-certificates',
  templateUrl: './upload-certificates.component.html',
  styleUrl: './upload-certificates.component.css',
})
export class UploadCertificatesComponent {
  files: File[] = [];
  // uploadProgress = 0;
  category = '';
  @Output() modalClosed = new EventEmitter();
  constructor(
    private _teacherService: TeacherService,
    private _toasterService: ToasterService
  ) {}

  onFileSelected(event: any) {
    if (this.files.length >= 3) {
      this._toasterService.showError('You can upload a maximum of 3 files.');
      return;
    }

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      if (this.files.length >= 3) {
        this._toasterService.showError('You can upload a maximum of 3 files.');
        break;
      }
      if (file.type === 'application/pdf') {
        this.files.push(file);
      } else {
        this._toasterService.showError('Only PDF files are allowed.');
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (this.files.length >= 3) {
      this._toasterService.showError('You can upload a maximum of 3 files.');
      return;
    }

    if (event.dataTransfer) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i];
        if (this.files.length >= 3) {
          this._toasterService.showError(
            'You can upload a maximum of 3 files.'
          );
          break;
        }
        if (file.type === 'application/pdf') {
          this.files.push(file);
        } else {
          alert('Only PDF files are allowed.');
        }
      }
    }
  }

  removeFile(file: File) {
    this.files = this.files.filter((f) => f !== file);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.uploadFiles();
  }

  uploadFiles() {
    if (!this.category) {
      return this._toasterService.showError('Select category');
    }
    if (this.files.length <= 0) {
      return this._toasterService.showError('Upload file');
    }

    this._teacherService.uploadCertificates({
      category: this.category,
      certificates: this.files,
    }).subscribe(res=>{});

    // let uploaded = 0;
    // const interval = setInterval(() => {
    //   uploaded += 10;
    //   this.uploadProgress = (uploaded / this.files.length) * 100;
    //   if (uploaded >= 100) {
    //     clearInterval(interval);
    //   }
    // }, 500);
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
