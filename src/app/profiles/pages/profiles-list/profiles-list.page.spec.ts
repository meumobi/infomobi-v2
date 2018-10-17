import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesListPage } from './profiles-list.page';

describe('ProfilesListPage', () => {
  let component: ProfilesListPage;
  let fixture: ComponentFixture<ProfilesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
