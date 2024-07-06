import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { TokenStorageService } from "../shared-services/token-storage.service";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorageService = inject(TokenStorageService);
  const URLS_TO_EXCLUDE = [
    "api.ipify.org",
    "3.7.55.235:8000"
  ]

  for (const url of URLS_TO_EXCLUDE) {
    if (req.url.includes(url)) {
      return next(req);
    }
  }

  const idToken = tokenStorageService.getStorageKeyValue('idToken');
  console.log('idToken:', idToken)
  const  cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${idToken}`
    }
  });
  return next(cloned);
};
