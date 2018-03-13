import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLoginPageComponent } from './not-login-page.component';

describe('NotLoginPageComponent', () => {
  let component: NotLoginPageComponent;
  let fixture: ComponentFixture<NotLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotLoginPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
