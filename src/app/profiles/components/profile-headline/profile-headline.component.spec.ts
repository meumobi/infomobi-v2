import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeadlineComponent } from './profile-headline.component';

describe('ProfileHeadlineComponent', () => {
  let component: ProfileHeadlineComponent;
  let fixture: ComponentFixture<ProfileHeadlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHeadlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
