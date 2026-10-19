
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    return true;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;

    if (Date.now() < expirationTime) {
      return router.createUrlTree(['/user/dashboard']);
    }

    // Token has expired
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    return true;

  } catch (error) {
    // Invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    return true;
  }
};
