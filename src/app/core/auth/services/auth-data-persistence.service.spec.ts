import { TestBed } from '@angular/core/testing';

import { AuthDataPersistenceService } from './auth-data-persistence.service';

describe('AuthDataPersistenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthDataPersistenceService = TestBed.get(AuthDataPersistenceService);
    expect(service).toBeTruthy();
  });
});
