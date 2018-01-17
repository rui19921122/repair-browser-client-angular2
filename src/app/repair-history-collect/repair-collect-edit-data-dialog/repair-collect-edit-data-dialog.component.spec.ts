import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairCollectEditDataDialogComponent } from './repair-collect-edit-data-dialog.component';

describe('RepairCollectEditDataDialogComponent', () => {
  let component: RepairCollectEditDataDialogComponent;
  let fixture: ComponentFixture<RepairCollectEditDataDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairCollectEditDataDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairCollectEditDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
