import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairHistoryCollectIndexComponent } from './repair-history-collect-index.component';

describe('RepairHistoryCollectIndexComponent', () => {
  let component: RepairHistoryCollectIndexComponent;
  let fixture: ComponentFixture<RepairHistoryCollectIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairHistoryCollectIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairHistoryCollectIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
