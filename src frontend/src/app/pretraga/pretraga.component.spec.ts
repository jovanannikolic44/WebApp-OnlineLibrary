import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PretragaComponent } from './pretraga.component';

describe('PretragaComponent', () => {
  let component: PretragaComponent;
  let fixture: ComponentFixture<PretragaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PretragaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PretragaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
