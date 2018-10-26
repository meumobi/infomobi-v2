import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsListPage } from './comments-list.page';

describe('CommentsListPage', () => {
  let component: CommentsListPage;
  let fixture: ComponentFixture<CommentsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
