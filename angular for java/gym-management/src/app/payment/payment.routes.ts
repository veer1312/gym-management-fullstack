import { Routes } from '@angular/router';
import { AddPayment } from './add-payment/add-payment';



export const PAYMENT_ROUTES: Routes = [
  {
    path: 'add-payment',
    component: AddPayment
  }

];
