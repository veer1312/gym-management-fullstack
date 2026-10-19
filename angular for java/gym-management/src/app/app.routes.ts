import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { LoginPage } from './layout/login-page/login-page';
import { loginGuard } from './guards/login-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component:LoginPage,
    canActivate: [loginGuard]
  },
  // Main application
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'user',
        canActivate: [authGuard],
        loadChildren: () => import('./user/user.routes').then((m) => m.USER_ROUTES),
      },
      {
        path: 'payment',
        canActivate: [authGuard],
        loadChildren: () => import('./payment/payment.routes').then((m) => m.PAYMENT_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
