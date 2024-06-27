import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentManagemetComponent } from './payment-managemet.component';

describe('PaymentManagemetComponent', () => {
  let component: PaymentManagemetComponent;
  let fixture: ComponentFixture<PaymentManagemetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentManagemetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentManagemetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
