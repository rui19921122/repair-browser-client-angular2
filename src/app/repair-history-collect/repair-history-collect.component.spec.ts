import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairHistoryCollectComponent } from './repair-history-collect.component';

describe('RepairHistoryCollectComponent', () => {
  let component: RepairHistoryCollectComponent;
  let fixture: ComponentFixture<RepairHistoryCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairHistoryCollectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairHistoryCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
