import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCourseManageComponent } from './teacher-course-manage.component';

describe('TeacherCourseManageComponent', () => {
  let component: TeacherCourseManageComponent;
  let fixture: ComponentFixture<TeacherCourseManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherCourseManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCourseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
