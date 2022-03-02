import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrikazKnjigeComponent } from './prikaz-knjige.component';

describe('PrikazKnjigeComponent', () => {
  let component: PrikazKnjigeComponent;
  let fixture: ComponentFixture<PrikazKnjigeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrikazKnjigeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrikazKnjigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
