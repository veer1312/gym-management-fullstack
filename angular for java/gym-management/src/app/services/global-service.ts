import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public apiUrl = environment.apiUrl;

  public loginUrl = this.apiUrl + '/users/login';
  public addMember = this.apiUrl + '/users/create';
  public getUserList = this.apiUrl + '/users/getAllUsers';
  public getUSerDetails = this.apiUrl + '/users/getUserById';
  public updateUser = this.apiUrl + '/users/updateUser';
  public membershipPlan = this.apiUrl + '/membershipPlans/getMembershipPlan';
  public addUserPayment = this.apiUrl + '/payments/addPayment';

  // Payment membership
  public getPaymentById = this.apiUrl + '/payments/getPaymentById';
}
