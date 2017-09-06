import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCardComponent } from './date-card.component';

describe('DateCardComponent', () => {
  let component: DateCardComponent;
  let fixture: ComponentFixture<DateCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
