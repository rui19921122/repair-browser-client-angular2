import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPostDataDialogComponent } from './check-post-data-dialog.component';

describe('CheckPostDataDialogComponent', () => {
  let component: CheckPostDataDialogComponent;
  let fixture: ComponentFixture<CheckPostDataDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckPostDataDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPostDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
