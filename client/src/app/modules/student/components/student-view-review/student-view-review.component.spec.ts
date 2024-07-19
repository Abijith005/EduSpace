import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewReviewComponent } from './student-view-review.component';

describe('StudentViewReviewComponent', () => {
  let component: StudentViewReviewComponent;
  let fixture: ComponentFixture<StudentViewReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentViewReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentViewReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
