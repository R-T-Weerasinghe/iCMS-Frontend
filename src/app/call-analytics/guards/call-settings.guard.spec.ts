import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { callSettingsGuard } from './call-settings.guard';

describe('callSettingsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => callSettingsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
