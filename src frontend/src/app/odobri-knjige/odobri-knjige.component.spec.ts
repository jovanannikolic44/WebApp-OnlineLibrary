import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdobriKnjigeComponent } from './odobri-knjige.component';

describe('OdobriKnjigeComponent', () => {
  let component: OdobriKnjigeComponent;
  let fixture: ComponentFixture<OdobriKnjigeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdobriKnjigeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdobriKnjigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
