import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user-service/user-service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader';
import { Loaderservice } from '../../shared/service/loaderservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-member-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css',
})
export class MemberDetails implements OnInit {
  memberForm!: FormGroup;

  userId!: number;

  loading = false;
  submitted = false;

  membershipPlans: any[] = [];
  loadingPlans = false;
  planError = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private loaderService: Loaderservice,
  ) {}

  ngOnInit(): void {
    this.loadMembershipPlans();
    this.createForm();

    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    console.log('User ID:', this.userId);

    this.getUserDetails();
  }

  createForm(): void {
    this.memberForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],

      gender: ['', Validators.required],

      dateOfBirth: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],

      address: ['', Validators.required],

      membershipId: ['', Validators.required],

      membershipStartDate: ['', Validators.required],

      membershipEndDate: [''],

      emergencyContactName: ['', Validators.required],

      emergencyRelationship: ['', Validators.required],

      emergencyContactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  getUserDetails(): void {
    this.loading = true;
    this.loaderService.show();

    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        console.log('User Details:', response);

        this.memberForm.patchValue({
          name: response.name,
          gender: response.gender,
          dateOfBirth: response.dateOfBirth,
          email: response.email,
          contactNumber: response.contactNumber,
          address: response.address,

          membershipId: response.membershipId,
          membershipStartDate: response.membershipStartDate,
          membershipEndDate: response.membershipEndDate,

          emergencyContactName: response.emergencyContactName,
          emergencyRelationship: response.emergencyRelationship,
          emergencyContactNumber: response.emergencyContactNumber,
        });

        this.loading = false;
        this.loaderService.hide();
      },

      error: (error) => {
        console.error('Error getting user:', error);

        this.loading = false;
        this.loaderService.hide();
      },
    });
  }

  updateUser(): void {
  this.submitted = true;

  if (this.memberForm.invalid) {
    this.memberForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.loaderService.show();

  this.userService.updateUser(this.userId, this.memberForm.value).subscribe({
    next: (response) => {
      console.log('Update response:', response);

      this.loading = false;
      this.loaderService.hide();

      Swal.fire({
        icon: 'success',
        title: 'Member Updated!',
        text: 'Member details have been updated successfully.',
        confirmButtonText: 'OK',
      }).then(() => {
        this.router.navigate(['/user/member-list']);
      });
    },

    error: (error) => {
      console.error('Update member failed:', error);

      this.loading = false;
      this.loaderService.hide();
    },
  });
}

  cancel(): void {
    this.router.navigate(['/user/member-list']);
  }

  loadMembershipPlans(): void {
   this.loading = true;
        this.loaderService.show();
    this.planError = '';

    this.userService.getMembershipPlans().subscribe({
      next: (response: any[]) => {
        this.membershipPlans = response;
        this.loading = false;
        this.loaderService.hide();
      },
      error: (error) => {
        console.error('Error loading membership plans:', error);
        this.planError = 'Unable to load membership plans.';
        this.loading = false;
        this.loaderService.hide();
      },
    });
  }
}
