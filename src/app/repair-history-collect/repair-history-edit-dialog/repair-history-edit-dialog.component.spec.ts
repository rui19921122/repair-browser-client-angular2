import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairHistoryEditDialogComponent } from './repair-history-edit-dialog.component';

describe('RepairHistoryEditDialogComponent', () => {
  let component: RepairHistoryEditDialogComponent;
  let fixture: ComponentFixture<RepairHistoryEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairHistoryEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairHistoryEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
