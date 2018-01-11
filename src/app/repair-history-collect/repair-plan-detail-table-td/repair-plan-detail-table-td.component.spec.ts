import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairPlanDetailTableTdComponent } from './repair-plan-detail-table-td.component';

describe('RepairPlanDetailTableTdComponent', () => {
  let component: RepairPlanDetailTableTdComponent;
  let fixture: ComponentFixture<RepairPlanDetailTableTdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairPlanDetailTableTdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairPlanDetailTableTdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
