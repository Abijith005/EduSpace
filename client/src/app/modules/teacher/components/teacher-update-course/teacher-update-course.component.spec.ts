import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherUpdateCourseComponent } from './teacher-update-course.component';

describe('TeacherUpdateCourseComponent', () => {
  let component: TeacherUpdateCourseComponent;
  let fixture: ComponentFixture<TeacherUpdateCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherUpdateCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherUpdateCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
