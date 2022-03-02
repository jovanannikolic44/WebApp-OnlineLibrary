import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegKorComponent } from './reg-kor.component';

describe('RegKorComponent', () => {
  let component: RegKorComponent;
  let fixture: ComponentFixture<RegKorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegKorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegKorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
