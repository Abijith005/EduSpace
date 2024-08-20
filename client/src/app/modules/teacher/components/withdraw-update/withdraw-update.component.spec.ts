import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawUpdateComponent } from './withdraw-update.component';

describe('WithdrawUpdateComponent', () => {
  let component: WithdrawUpdateComponent;
  let fixture: ComponentFixture<WithdrawUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
