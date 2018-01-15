import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairHistoryMonthQueryComponent } from './repair-history-month-query.component';

describe('RepairHistoryMonthQueryComponent', () => {
  let component: RepairHistoryMonthQueryComponent;
  let fixture: ComponentFixture<RepairHistoryMonthQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairHistoryMonthQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairHistoryMonthQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
