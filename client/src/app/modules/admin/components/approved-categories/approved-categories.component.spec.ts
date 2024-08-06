import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedCategoriesComponent } from './approved-categories.component';

describe('ApprovedCategoriesComponent', () => {
  let component: ApprovedCategoriesComponent;
  let fixture: ComponentFixture<ApprovedCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovedCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
