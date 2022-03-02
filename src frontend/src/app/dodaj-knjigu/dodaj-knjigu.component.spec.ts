import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajKnjiguComponent } from './dodaj-knjigu.component';

describe('DodajKnjiguComponent', () => {
  let component: DodajKnjiguComponent;
  let fixture: ComponentFixture<DodajKnjiguComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodajKnjiguComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodajKnjiguComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
