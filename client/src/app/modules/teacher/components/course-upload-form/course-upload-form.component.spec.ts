import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUploadFormComponent } from './course-upload-form.component';

describe('CourseUploadFormComponent', () => {
  let component: CourseUploadFormComponent;
  let fixture: ComponentFixture<CourseUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseUploadFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
