import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmapleComponent } from './smaple.component';

describe('SmapleComponent', () => {
  let component: SmapleComponent;
  let fixture: ComponentFixture<SmapleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmapleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmapleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
