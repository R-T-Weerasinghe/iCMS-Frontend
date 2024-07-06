import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { callOperatorsGuard } from './call-operators.guard';

describe('callOperatorsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => callOperatorsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
