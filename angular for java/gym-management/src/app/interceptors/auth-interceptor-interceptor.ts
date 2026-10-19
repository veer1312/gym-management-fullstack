
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  try {
    const payload = JSON.parse(atob(
      token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    ));

    const expirationTime = payload.exp * 1000;
    const remainingTime = expirationTime - Date.now();

    if (!payload.exp || remainingTime <= 0) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      router.navigate(['/login']);

      return next(req);
    }

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);

  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    router.navigate(['/login']);

    return next(req);
  }
};
