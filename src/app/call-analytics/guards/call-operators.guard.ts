import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { TokenStorageService } from "../../shared/shared-services/token-storage.service";

export const callOperatorsGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenStorageService = inject(TokenStorageService);
  let permissions = tokenStorageService.getStorageKeyValue("permissions");
  let isAbleToView = permissions.includes("View Call Operators");
  if (isAbleToView) {
    return true;
  }
  router.navigate(["/unauthorized"]);
  return false;
};
