import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAboutCourseComponent } from './student-about-course.component';

describe('StudentAboutCourseComponent', () => {
  let component: StudentAboutCourseComponent;
  let fixture: ComponentFixture<StudentAboutCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentAboutCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAboutCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
