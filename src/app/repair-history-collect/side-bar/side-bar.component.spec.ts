import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairHistoryCollectSideBarComponent } from './repair-history-collect-side-bar.component';

describe('RepairHistoryCollectSideBarComponent', () => {
  let component: RepairHistoryCollectSideBarComponent;
  let fixture: ComponentFixture<RepairHistoryCollectSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairHistoryCollectSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairHistoryCollectSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
