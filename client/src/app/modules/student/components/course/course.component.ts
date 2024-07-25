import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourseDetails } from '../../../../interfaces/courseDetails';
import { StudentService } from '../../student.service';
import { Subject, map, of, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.css',
})
export class CourseComponent implements OnInit, OnDestroy {
  course$ = of<ICourseDetails | null>(null);
  selectedVideo: { url: string; key: string } | null = null;
  isLoading$ = of(true);
  course_id!: string;
  messageInput: string = '';
  messages: string[] = [];
  textareaHeight: number = 41;

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private _activateRoute: ActivatedRoute,
    private _studentService: StudentService
  ) {}

  ngOnInit(): void {
    this._activateRoute.paramMap.subscribe((params) => {
      this.course_id = params.get('id')!;
    });
    this.getCourseDetails();
  }

  getCourseDetails() {
    this.course$ = this._studentService.getCourseDetails(this.course_id).pipe(
      takeUntil(this._ngUnsubscribe$),
      tap(() => (this.isLoading$ = of(false))),
      map((response) => response.courseDetails)
    );
  }

  changeVideo(video: { key: string; url: string }) {
    this.selectedVideo = video;
  }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    this.textareaHeight = Math.min(textarea.scrollHeight, 80);
  }

  sendMessage(): void {
    if (this.messageInput.trim()) {
      this.messages.push(this.messageInput);
      this.messageInput = '';
      this.textareaHeight = 41;
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
    this._ngUnsubscribe$.complete();
  }
}
