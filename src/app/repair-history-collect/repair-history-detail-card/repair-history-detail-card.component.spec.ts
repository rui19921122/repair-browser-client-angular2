import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairHistoryDetailCardComponent } from './repair-history-detail-card.component';

describe('RepairHistoryDetailCardComponent', () => {
  let component: RepairHistoryDetailCardComponent;
  let fixture: ComponentFixture<RepairHistoryDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairHistoryDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairHistoryDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
