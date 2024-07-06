import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { callFilterGuard } from './call-filter.guard';

describe('callFilterGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => callFilterGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
