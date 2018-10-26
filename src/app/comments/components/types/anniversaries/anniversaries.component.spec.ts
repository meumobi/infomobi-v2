import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnniversariesComponent } from './anniversaries.component';

describe('AnniversariesComponent', () => {
  let component: AnniversariesComponent;
  let fixture: ComponentFixture<AnniversariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnniversariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnniversariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
