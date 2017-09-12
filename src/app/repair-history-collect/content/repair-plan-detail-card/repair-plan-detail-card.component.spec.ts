import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairPlanDetailCardComponent } from './repair-plan-detail-card.component';

describe('RepairPlanDetailCardComponent', () => {
  let component: RepairPlanDetailCardComponent;
  let fixture: ComponentFixture<RepairPlanDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairPlanDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairPlanDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
