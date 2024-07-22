import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSubscriptionComponent } from './student-subscription.component';

describe('StudentSubscriptionComponent', () => {
  let component: StudentSubscriptionComponent;
  let fixture: ComponentFixture<StudentSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentSubscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
