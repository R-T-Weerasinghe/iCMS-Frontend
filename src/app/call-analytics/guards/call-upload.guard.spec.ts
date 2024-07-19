import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { callUploadGuard } from './call-upload.guard';

describe('callUploadGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => callUploadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
