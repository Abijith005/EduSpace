import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../teacher.service';
import { Subject, takeUntil } from 'rxjs';
import { IcategoryData } from '../../../../interfaces/categoryData';
import { ToasterService } from '../../../shared/toaster.service';
@Component({
  selector: 'app-course-upload-form',
  templateUrl: './course-upload-form.component.html',
  styleUrl: './course-upload-form.component.css',
})
export class CourseUploadFormComponent implements OnInit, OnDestroy {
  @Output() modalClosed = new EventEmitter();
  courseDetailsForm!: FormGroup;
  isSubmitted: boolean = false;
  categories!: IcategoryData[];
  previewVideoFiles: File[] = [];
  previewImageFiles: File[] = [];
  videoFiles: File[] = [];
  notesFiles: File[] = [];

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _fb: FormBuilder,
    private _toaster: ToasterService,
    private _teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.courseDetailsForm = this._fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      about: ['', [Validators.required]],
      price: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
    });

    this._teacherService
      .getAllCategories()
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.categories = res.categories;
      });
  }

  get formContols() {
    return this.courseDetailsForm.controls;
  }

  onFileChange(event: Event, fileCategory: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      if (fileCategory === 'previewVideo') {
        if (filesArray.length <= 1) {
          this.previewVideoFiles = filesArray;
        } else {
          this._toaster.showError('Max. 1 preview video is allowed');
        }
      } else if (fileCategory === 'videos') {
        const remainingSlot = 3 - this.videoFiles.length;
        if (filesArray.length <= remainingSlot) {
          this.videoFiles.push(...filesArray);
        } else {
          this._toaster.showError('Max. 3 videos are allowed');
        }
      } else if (fileCategory === 'notes') {
        const remainingSlot = 3 - this.notesFiles.length;
        if (filesArray.length <= remainingSlot) {
          this.notesFiles.push(...filesArray);
        } else {
          this._toaster.showError('Max. 3 notes are allowed');
        }
      } else if (fileCategory === 'previewImage') {
        if (filesArray.length <= 1) {
          this.previewImageFiles = filesArray;
        } else {
          this._toaster.showError('Max. 1 preview image is allowed');
        }
      }
    }
  }

  removeFiles(fileCategory: string, index: number) {
    if (fileCategory === 'videos') {
      this.videoFiles.splice(index, 1);
    } else if (fileCategory === 'notes') {
      this.notesFiles.splice(index, 1);
    } else if (fileCategory === 'previewVideo') {
      this.previewVideoFiles.pop();
    } else if (fileCategory === 'previewImage') {
      this.previewImageFiles.pop();
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.courseDetailsForm.invalid) {
      return;
    }

    if (
      this.previewVideoFiles.length === 0 ||
      this.videoFiles.length === 0 ||
      this.notesFiles.length === 0
    ) {
      this._toaster.showError('Please upload all required files.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.courseDetailsForm.get('title')?.value);
    formData.append('category_id', this.courseDetailsForm.get('category')?.value);
    formData.append('about', this.courseDetailsForm.get('about')?.value);
    formData.append('price', this.courseDetailsForm.get('price')?.value);

    this.previewVideoFiles.forEach((file: File) => {
      formData.append('previewVideo', file);
    });

    this.previewImageFiles.forEach((file: File) => {
      formData.append('previewImage', file);
    });

    this.videoFiles.forEach((file: File) => {
      formData.append('videos', file);
    });

    this.notesFiles.forEach((file: File) => {
      formData.append('notes', file);
    });

    this._teacherService
      .uploadCourse(formData)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this._toaster.toasterFunction(res);
        if (res.success) {
          this.closeModal();
        }
      });
  }

  closeModal() {
    this.modalClosed.emit();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
