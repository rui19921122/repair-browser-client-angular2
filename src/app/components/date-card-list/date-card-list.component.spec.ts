import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCardListComponent } from './date-card-list.component';

describe('DateCardListComponent', () => {
  let component: DateCardListComponent;
  let fixture: ComponentFixture<DateCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
