import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);

      // ==========================================
      // 401 - Unauthorized
      // ==========================================

      if (error.status === 401) {
        if (req.url.includes('/login')) {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password.',
            confirmButtonText: 'Try Again',
          });
        } else {
          const token = localStorage.getItem('token');

          if (token) {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');

            Swal.fire({
              icon: 'warning',
              title: 'Session Expired',
              text: 'Your session has expired. Please login again.',
              confirmButtonText: 'Login',
              allowOutsideClick: false,
            }).then(() => {
              router.navigate(['/login']);
            });
          } else {
            router.navigate(['/login']);
          }
        }
      }

      // ==========================================
      // 403 - Forbidden
      // ==========================================
      else if (error.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'You do not have permission to perform this action.',
        });
      }

      // ==========================================
      // 404 - Not Found
      // ==========================================
      else if (error.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Not Found',
          text: 'The requested resource was not found.',
        });
      }

      // ==========================================
      // 409 - Conflict
      // ==========================================
      else if (error.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Already Exists',
          text: error.error?.message || 'This data already exists.',
        });
      }

      // ==========================================
      // 500 - Server Error
      // ==========================================
      else if (error.status === 500) {
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'Something went wrong on the server.',
        });
      }

      // ==========================================
      // 0 - Connection Error
      // ==========================================
      else if (error.status === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'Unable to connect to the server.',
        });
      }

      // ==========================================
      // Other Errors
      // ==========================================
      else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Something went wrong.',
        });
      }

      // Send the error back to the service/component
      return throwError(() => error);
    }),
  );
};
