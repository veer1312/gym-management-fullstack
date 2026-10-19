
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;

    if (Date.now() < expirationTime) {
      return true;
    }

    // Token expired
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    return router.createUrlTree(['/login']);
  } catch {
    // Invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    return router.createUrlTree(['/login']);
  }
};
