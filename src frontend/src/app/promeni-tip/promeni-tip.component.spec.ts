import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromeniTipComponent } from './promeni-tip.component';

describe('PromeniTipComponent', () => {
  let component: PromeniTipComponent;
  let fixture: ComponentFixture<PromeniTipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromeniTipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromeniTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
