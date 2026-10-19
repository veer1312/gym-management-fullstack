import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from '../global-service';

@Injectable({
  providedIn: 'root',
})
export class Payment {
  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
  ) {}

  createPayment(paymentData: {
    userId: number;
    membershipId: number;
    membershipStartDate: string;
    membershipEndDate: string | null;
    amount: number;
    paymentMethod: string;
  }): Observable<any> {
    return this.http.post<any>(this.globalService.addUserPayment, paymentData);
  }

getPaymentById(id: number): Observable<any> {
  return this.http.get<any>(`${this.globalService.getPaymentById}/${id}`);
}

verifyPaymentAndAddPayment(data: any) {
  return this.http.post<any>(
    'http://localhost:8080/api/payments/verify-and-add-payment',
    data
  );
}

createPaymentOrder(data: { membershipId: number; amount: number;email?: string; }) {
    return this.http.post<any>('http://localhost:8080/api/payments/create-order', data);
  }
}
