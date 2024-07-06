import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { TokenStorageService } from "../../shared/shared-services/token-storage.service";

export const callUploadGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenStorageService = inject(TokenStorageService);
  let permissions = tokenStorageService.getStorageKeyValue("permissions");
  let isAbleToUpload = permissions.includes("Add Call Recording");
  if (isAbleToUpload) {
    return true;
  }
  router.navigate(["/unauthorized"]);
  return false
};
