import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiliComponent } from './profili.component';

describe('ProfiliComponent', () => {
  let component: ProfiliComponent;
  let fixture: ComponentFixture<ProfiliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
