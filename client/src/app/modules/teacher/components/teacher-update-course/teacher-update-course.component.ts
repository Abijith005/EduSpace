import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { IcategoryData } from '../../../../interfaces/categoryData';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToasterService } from '../../../shared/toaster.service';
import { TeacherService } from '../../teacher.service';
import { IcourseDetails } from '../../../../interfaces/courseDetails';

@Component({
  selector: 'app-teacher-update-course',
  templateUrl: './teacher-update-course.component.html',
  styleUrl: './teacher-update-course.component.css',
})
export class TeacherUpdateCourseComponent implements OnInit, OnDestroy {
  @Input() courseDataInput!: IcourseDetails;
  @Input() categories!: IcategoryData[];
  @Output() modalClosed = new EventEmitter();
  courseDetailsForm!: FormGroup;
  isSubmitted: boolean = false;
  previewVideoFiles: any[] = [];
  previewImageFiles: any[] = [];
  videoFiles: any[] = [];
  notesFiles: any[] = [];
  deletedFiles: any = {};
  courseData!: IcourseDetails;

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
    this.courseData = JSON.parse(JSON.stringify(this.courseDataInput));

    this.courseDetailsForm.patchValue({
      category: this.courseData.category_id._id,
      title:this.courseData.title,
      price:this.courseData.price,
      about:this.courseData.about
    });
    this.previewImageFiles = this.courseData.previewImage;
    this.previewVideoFiles = this.courseData.previewVideo;
    this.videoFiles = this.courseData.videos;
    this.notesFiles = this.courseData.notes;
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
    switch (fileCategory) {
      case 'videos':
        this.handleFileRemoval(fileCategory, this.videoFiles, index);
        break;
      case 'notes':
        this.handleFileRemoval(fileCategory, this.notesFiles, index);
        break;
      case 'previewVideo':
        this.handleFileRemoval(fileCategory, this.previewVideoFiles, index);
        break;
      case 'previewImage':
        this.handleFileRemoval(fileCategory, this.previewImageFiles, index);
        break;
    }
  }

  handleFileRemoval(fileCategory: string, fileArray: any[], index: number) {

    if (!this.deletedFiles[fileCategory]) {
      this.deletedFiles[fileCategory] = [];
    }
    const removedFile = fileArray.splice(index, 1)[0];
    if (removedFile.key) {
      this.deletedFiles[fileCategory].push(removedFile.key);
    }
    console.log(this.deletedFiles);
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
    formData.append(
      'category_id',
      this.courseDetailsForm.get('category')?.value
    );
    formData.append('about', this.courseDetailsForm.get('about')?.value);
    formData.append('price', this.courseDetailsForm.get('price')?.value);
    formData.append('deletedFiles', JSON.stringify(this.deletedFiles));

    this.previewVideoFiles.forEach((file: File) => {
      if (file instanceof File) {
        formData.append('previewVideo', file);
      }
    });

    this.previewImageFiles.forEach((file: File) => {
      if (file instanceof File) {
        formData.append('previewImage', file);
      }
    });

    this.videoFiles.forEach((file: File) => {
      if (file instanceof File) {
        formData.append('videos', file);
      }
    });

    this.notesFiles.forEach((file: File) => {
      if (file instanceof File) {
        formData.append('notes', file);
      }
    });

    console.log(formData);

    this._teacherService
      .updateCourse(formData, this.courseData._id)
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
