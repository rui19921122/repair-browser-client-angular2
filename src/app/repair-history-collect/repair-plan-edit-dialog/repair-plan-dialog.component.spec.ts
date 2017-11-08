import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairPlanEditDialogComponent } from './repair-plan-dialog.component';

describe('RepairPlanEditDialogComponent', () => {
  let component: RepairPlanEditDialogComponent;
  let fixture: ComponentFixture<RepairPlanEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairPlanEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairPlanEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
