import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentEditPage } from './comment-edit.page';

describe('CommentEditPage', () => {
  let component: CommentEditPage;
  let fixture: ComponentFixture<CommentEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
