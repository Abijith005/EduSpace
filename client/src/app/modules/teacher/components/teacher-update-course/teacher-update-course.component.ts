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
import { FileNameExtractorPipe } from '../../../shared/pipes/file-name-extractor.pipe';
interface IcourseData {
  _id: string;
  title: string;
  about: string;
  category_id: {
    _id: string;
    title: string;
  };
  contents: string[];
  courseLanguage: string;
  courseLevel: string;
  price: number;
  processingStatus: ProcessingStatus;
}
enum ProcessingStatus {
  Uploading = 'uploading',
  Updating = 'updating',
  Completed = 'completed',
}

@Component({
  selector: 'app-teacher-update-course',
  templateUrl: './teacher-update-course.component.html',
  styleUrl: './teacher-update-course.component.css',
})
export class TeacherUpdateCourseComponent implements OnInit, OnDestroy {
  @Input() courseDataInput!: IcourseDetails;
  @Input() categories!: IcategoryData[];
  @Output() modalClosed = new EventEmitter();
  @Output() courseDataUpdated = new EventEmitter<IcourseData>();
  courseDetailsForm!: FormGroup;
  isSubmitted: boolean = false;
  previewVideoFiles: any[] = [];
  previewImageFiles: any[] = [];
  videoFiles: any[] = [];
  notesFiles: any[] = [];
  deletedFiles: any = {};
  courseData!: IcourseDetails;
  newContent: string = '';
  contents: string[] = [];
  step: number = 1;
  languageList = [
    'Albanian',
    'Arabic',
    'Armenian',
    'Azerbaijani',
    'Basque',
    'Belarusian',
    'Bengali',
    'Bosnian',
    'Bulgarian',
    'Burmese',
    'Catalan',
    'Cebuano',
    'Chichewa',
    'Chinese',
    'Corsican',
    'Croatian',
    'Czech',
    'Danish',
    'Dutch',
    'English',
    'Esperanto',
    'Estonian',
    'Ewe',
    'Finnish',
    'French',
    'Frisian',
    'Galician',
    'Georgian',
    'German',
    'Greek',
    'Guarani',
    'Gujarati',
    'Haitian Creole',
    'Hausa',
    'Hawaiian',
    'Hebrew',
    'Hindi',
    'Hmong',
    'Hungarian',
    'Icelandic',
    'Igbo',
    'Indonesian',
    'Irish',
    'Italian',
    'Japanese',
    'Javanese',
    'Kannada',
    'Kazakh',
    'Khmer',
    'Kinyarwanda',
    'Korean',
    'Kurdish (Kurmanji)',
    'Kyrgyz',
    'Lao',
    'Latin',
    'Latvian',
    'Lithuanian',
    'Luxembourgish',
    'Macedonian',
    'Malagasy',
    'Malay',
    'Malayalam',
    'Maltese',
    'Maori',
    'Marathi',
    'Mongolian',
    'Nepali',
    'Norwegian',
    'Nyanja',
    'Odia',
    'Pashto',
    'Persian',
    'Polish',
    'Portuguese',
    'Punjabi',
    'Romanian',
    'Russian',
    'Samoan',
    'Scots Gaelic',
    'Serbian',
    'Sesotho',
    'Shona',
    'Sindhi',
    'Sinhala',
    'Slovak',
    'Slovenian',
    'Somali',
    'Spanish',
    'Sundanese',
    'Swahili',
    'Swedish',
    'Tagalog',
    'Tajik',
    'Tamil',
    'Tatar',
    'Telugu',
    'Thai',
    'Turkish',
    'Ukrainian',
    'Urdu',
    'Uzbek',
    'Vietnamese',
    'Welsh',
    'Xhosa',
    'Yiddish',
    'Yoruba',
    'Zulu',
  ];
  levelList = ['Beginner', 'Intermediate', 'Advanced'];

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _fb: FormBuilder,
    private _toaster: ToasterService,
    private _teacherService: TeacherService,
    private _fileNameExtractorPipe: FileNameExtractorPipe
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
      courseLanguage: ['', [Validators.required]],
      courseLevel: ['', [Validators.required]],
      content: [''],
    });
    this.courseData = JSON.parse(JSON.stringify(this.courseDataInput));

    this.courseDetailsForm.patchValue({
      category: this.courseData.category_id._id,
      title: this.courseData.title,
      price: this.courseData.price,
      about: this.courseData.about,
      courseLanguage: this.courseData.courseLanguage,
      courseLevel: this.courseData.courseLevel,
    });
    this.contents = this.courseData.contents;
    this.previewImageFiles = this.courseData.previewImage;
    this.previewVideoFiles = this.courseData.previewVideo;
    this.videoFiles = this.courseData.videos;
    this.notesFiles = this.courseData.notes;

  }

  get formControls() {
    return this.courseDetailsForm.controls;
  }

  addContent() {
    if (this.newContent.trim()) {

      this.contents.unshift(this.newContent.trim());
      this.newContent = '';
    }
  }

  removeContent(index: number) {
    this.contents.splice(index, 1);
  }
  nextStep() {
    if (this.contents.length < 3) {
      this.formControls['content'].setErrors({ required: true });
    }
    if (this.step === 1 && this.courseDetailsForm.invalid) {
      this.isSubmitted = true;
      return;
    }
    this.step++;
  }

  prevStep() {
    this.step--;
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
    formData.append(
      'courseLanguage',
      this.courseDetailsForm.get('courseLanguage')?.value
    );
    formData.append(
      'courseLevel',
      this.courseDetailsForm.get('courseLevel')?.value
    );
    formData.append('contents', JSON.stringify(this.contents));
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

    this._teacherService
      .updateCourse(formData, this.courseData._id)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this._toaster.toasterFunction(res);
        if (res.success) {
          this.updateCourseData(this.courseData._id);
          this.closeModal();
        }
      });
  }


  getNoteDisplayName(note: File | { key: string }): string {
  if (note instanceof File) {
    return note.name;
  } else {
    return this._fileNameExtractorPipe.transform(note.key);
  }
}


  updateCourseData(courseId: string) {
    const data: IcourseData = {
      _id: courseId,
      title: this.courseDetailsForm.get('title')?.value,
      about: this.courseDetailsForm.get('about')?.value,
      category_id: {
        _id: this.courseDetailsForm.get('category')?.value,
        title:
          this.categories.find(
            (category) =>
              category._id === this.courseDetailsForm.get('category')?.value
          )?.title || '',
      },
      contents: this.contents,
      courseLanguage: this.courseDetailsForm.get('courseLanguage')?.value,
      courseLevel: this.courseDetailsForm.get('courseLevel')?.value,
      price: this.courseDetailsForm.get('price')?.value,
      processingStatus: ProcessingStatus.Updating,
    };

    this.courseDataUpdated.emit(data);
  }

  closeModal() {
    this.modalClosed.emit();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
