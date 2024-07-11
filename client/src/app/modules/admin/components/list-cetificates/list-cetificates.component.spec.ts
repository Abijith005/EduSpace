import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCetificatesComponent } from './list-cetificates.component';

describe('ListCetificatesComponent', () => {
  let component: ListCetificatesComponent;
  let fixture: ComponentFixture<ListCetificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCetificatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCetificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
