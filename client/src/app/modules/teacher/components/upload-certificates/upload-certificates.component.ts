import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TeacherService } from '../../teacher.service';
import { Subject, takeUntil } from 'rxjs';
import { IcategoryData } from '../../../../interfaces/categoryData';
import { ToasterService } from '../../../shared/toaster.service';

@Component({
  selector: 'app-upload-certificates',
  templateUrl: './upload-certificates.component.html',
  styleUrl: './upload-certificates.component.css',
})
export class UploadCertificatesComponent implements OnInit, OnDestroy {
  files: File[] = [];
  categories!: IcategoryData[];
  Selectedategory = '';
  private _ngUnsubscribe = new Subject<void>();
  @Output() modalClosed = new EventEmitter();
  constructor(
    private _teacherService: TeacherService,
    private _toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this._teacherService
      .getAllCategories()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((res) => {
        this.categories = res.categories;
      });
  }

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
  selectCategory(categoryId: string) {
    this.Selectedategory = categoryId;
  }

  removeFile(file: File) {
    this.files = this.files.filter((f) => f !== file);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.uploadFiles();
  }

  uploadFiles() {
    if (!this.Selectedategory) {
      return this._toasterService.showError('Select category');
    }
    if (this.files.length <= 0) {
      return this._toasterService.showError('Upload file');
    }

    this._teacherService
      .uploadCertificates({
        category: this.Selectedategory,
        certificates: this.files,
      })
      .subscribe((res) => {
        if (res.success) {
          this.closeModal();
          this._toasterService.showSuccess(res.message);
        } else {
          this._toasterService.showError(res.message);
        }
      });
  }

  closeModal() {
    this.modalClosed.emit();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
