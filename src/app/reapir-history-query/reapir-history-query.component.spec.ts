import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReapirHistoryQueryComponent } from './reapir-history-query.component';

describe('ReapirHistoryQueryComponent', () => {
  let component: ReapirHistoryQueryComponent;
  let fixture: ComponentFixture<ReapirHistoryQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReapirHistoryQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReapirHistoryQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
