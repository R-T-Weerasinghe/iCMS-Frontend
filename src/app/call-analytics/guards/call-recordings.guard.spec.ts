import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { callRecordingsGuard } from './call-recordings.guard';

describe('callRecordingsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => callRecordingsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
