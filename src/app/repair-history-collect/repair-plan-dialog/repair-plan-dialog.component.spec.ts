import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairPlanDialogComponent } from './repair-plan-dialog.component';

describe('RepairPlanDialogComponent', () => {
  let component: RepairPlanDialogComponent;
  let fixture: ComponentFixture<RepairPlanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairPlanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
