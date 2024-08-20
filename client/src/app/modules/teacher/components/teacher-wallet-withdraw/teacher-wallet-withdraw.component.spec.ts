import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherWalletWithdrawComponent } from './teacher-wallet-withdraw.component';

describe('TeacherWalletWithdrawComponent', () => {
  let component: TeacherWalletWithdrawComponent;
  let fixture: ComponentFixture<TeacherWalletWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherWalletWithdrawComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherWalletWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
