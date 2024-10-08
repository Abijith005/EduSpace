import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWithdrawRequestComponent } from './view-withdraw-request.component';

describe('ViewWithdrawRequestComponent', () => {
  let component: ViewWithdrawRequestComponent;
  let fixture: ComponentFixture<ViewWithdrawRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewWithdrawRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWithdrawRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
