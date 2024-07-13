import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../teacher.service';
import { ICourseDetails } from '../../../../interfaces/courseDetails';
import { ModalService } from '../../../shared/modal.service';

@Component({
  selector: 'app-teacher-course-manage',
  templateUrl: './teacher-course-manage.component.html',
  styleUrl: './teacher-course-manage.component.css',
})
export class TeacherCourseManageComponent implements OnInit, OnDestroy {
  totalPages = 10;
  currentPage = 1;
  limit = 8;
  search = '';
  filter = '';
  courses!:ICourseDetails[]
  isVisible$ = this._modalService.isVisible$;

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _modalService: ModalService,
    private _teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this._teacherService
      .getAllCourses(this.currentPage, this.limit, this.search, this.filter)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        this.courses=res.courses  
        console.log(res);
            
          
      });
  }

  openModal() {
    this._modalService.openModal();
  }

  closeModal() {
    this._modalService.closeModal();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
