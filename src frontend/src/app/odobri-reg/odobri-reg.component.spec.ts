import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdobriRegComponent } from './odobri-reg.component';

describe('OdobriRegComponent', () => {
  let component: OdobriRegComponent;
  let fixture: ComponentFixture<OdobriRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdobriRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdobriRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
