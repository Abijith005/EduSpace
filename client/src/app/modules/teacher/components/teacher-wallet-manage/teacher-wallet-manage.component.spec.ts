import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherWalletManageComponent } from './teacher-wallet-manage.component';

describe('TeacherWalletManageComponent', () => {
  let component: TeacherWalletManageComponent;
  let fixture: ComponentFixture<TeacherWalletManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherWalletManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherWalletManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
