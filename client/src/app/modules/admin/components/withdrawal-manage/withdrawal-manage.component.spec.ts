import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalManageComponent } from './withdrawal-manage.component';

describe('WithdrawalManageComponent', () => {
  let component: WithdrawalManageComponent;
  let fixture: ComponentFixture<WithdrawalManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawalManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
