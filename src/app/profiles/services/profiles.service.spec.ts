import { TestBed } from '@angular/core/testing';

import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfilesService = TestBed.get(ProfilesService);
    expect(service).toBeTruthy();
  });
});
