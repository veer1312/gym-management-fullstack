import { Injectable } from '@angular/core';
import { GlobalService } from '../global-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private globalService: GlobalService,
    private http: HttpClient,
  ) {}

  login(formData: any) {
    return this.http.post(this.globalService.loginUrl, formData);
  }
  createMember(formData: any) {
    return this.http.post(this.globalService.addMember, formData);
  }

  getAllUsers(
    page: number,
    pageSize: number,
    search: string = '',
    status: string = '',
    paymentStatus: string = '',
  ): Observable<any> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    if (status) {
      params = params.set('status', status);
    }
    if (paymentStatus) {
      params = params.set('paymentStatus', paymentStatus);
    }
    return this.http.get<any>(this.globalService.getUserList, { params });
  }

  getMembershipPlans(): Observable<any[]> {
    return this.http.get<any[]>(this.globalService.membershipPlan);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.globalService.getUSerDetails}/${id}`);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.globalService.updateUser}/${id}`, userData);
  }

  createPaymentOrder(data: { membershipId: number; amount: number; email?: string }) {
    return this.http.post<any>('http://localhost:8080/api/payments/create-order', data);
  }

  verifyPaymentAndCreateMember(data: any) {
    return this.http.post<any>('http://localhost:8080/api/payments/verify-and-create-member', data);
  }
}
