import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairPlanEditTableTdComponent } from './repair-plan-edit-table-td.component';

describe('RepairPlanEditTableTdComponent', () => {
  let component: RepairPlanEditTableTdComponent;
  let fixture: ComponentFixture<RepairPlanEditTableTdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairPlanEditTableTdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairPlanEditTableTdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
