import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDashBoardComponent } from './teacher-dash-board.component';

describe('TeacherDashBoardComponent', () => {
  let component: TeacherDashBoardComponent;
  let fixture: ComponentFixture<TeacherDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherDashBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
