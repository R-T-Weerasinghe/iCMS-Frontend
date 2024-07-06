import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { TokenStorageService } from "../../shared/shared-services/token-storage.service";

export const callRecordingsGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenStorageService = inject(TokenStorageService);
  let permissions = tokenStorageService.getStorageKeyValue("permissions");
  let isAbleToView = permissions.includes("View Call Recordings");
  if (isAbleToView) {
    return true;
  }
  router.navigate(["/unauthorized"]);
  return false;
};
