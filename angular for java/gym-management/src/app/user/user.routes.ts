import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { UserProfile } from './user-profile/user-profile';
import { AddMembers } from './add-members/add-members';
import { MemberList } from './member-list/member-list';
import { MemberDetails } from './member-details/member-details';
import { MemberPaymentDetails } from './member-payment-details/member-payment-details';


export const USER_ROUTES: Routes = [
  {
    path: '',
    component: Dashboard
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'profile',
    component: UserProfile
  },
  {
    path: 'add-members',
    component: AddMembers
  }
  ,
  {
    path: 'member-list',
    component: MemberList
  },
  {
    path: 'member-details/:id',
    component: MemberDetails
  },
  {
    path: 'member-payment-details/:id',
    component: MemberPaymentDetails
  }
];
