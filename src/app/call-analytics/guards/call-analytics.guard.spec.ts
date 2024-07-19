import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { callAnalyticsGuard } from './call-analytics.guard';

describe('callAnalyticsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => callAnalyticsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
