import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user-service/user-service';
import { Loaderservice } from '../../shared/service/loaderservice';
import { LoaderComponent } from '../../shared/loader/loader';

declare var Razorpay: any;
@Component({
  selector: 'app-add-members',
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './add-members.html',
  styleUrl: './add-members.css',
})
export class AddMembers {
  memberForm: FormGroup;
  loading = false;
  submitted = false;

  membershipPlans: any[] = [];
  loadingPlans = false;
  planError = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private loaderService: Loaderservice,
  ) {
    this.memberForm = this.fb.group(
      {
        // Member Details
        name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],

        gender: ['', Validators.required],

        dateOfBirth: ['', Validators.required],

        email: ['', [Validators.required, Validators.email]],

        password: [''],

        confirmPassword: [''],

        contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],

        address: ['', Validators.required],

        // Membership
        membershipId: [null, Validators.required],

        membershipStartDate: ['', Validators.required],

        membershipEndDate: [''],

        // Payment
        amount: ['', [Validators.required, Validators.min(1)]],

        paymentMethod: ['', Validators.required],

        // Emergency Contact
        emergencyContactName: ['', Validators.required],

        emergencyRelationship: ['', Validators.required],

        emergencyContactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      },
      {
        validators: this.passwordMatchValidator(),
      },
    );
  }

  ngOnInit() {
    this.loadMembershipPlans();
  }

  // Password and Confirm Password validation
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;

      const confirmPassword = control.get('confirmPassword')?.value;

      // Both empty = password is optional
      if (!password && !confirmPassword) {
        return null;
      }

      // Password entered but confirm password empty
      if (password && !confirmPassword) {
        return {
          passwordMismatch: true,
        };
      }

      // Passwords don't match
      if (password !== confirmPassword) {
        return {
          passwordMismatch: true,
        };
      }

      return null;
    };
  }

  // Submit
  // addMember(): void {
  //   this.submitted = true;

  //   // Show all validation messages
  //   if (this.memberForm.invalid) {
  //     this.memberForm.markAllAsTouched();

  //     return;
  //   }

  //   this.loading = true;

  //   const memberData = {
  //     name: this.memberForm.value.name,

  //     gender: this.memberForm.value.gender,

  //     dateOfBirth: this.memberForm.value.dateOfBirth,

  //     email: this.memberForm.value.email,

  //     // Password is optional
  //     password: this.memberForm.value.password || null,

  //     contactNumber: this.memberForm.value.contactNumber,

  //     address: this.memberForm.value.address,

  //     membershipId: this.memberForm.value.membershipId,

  //     membershipStartDate: this.memberForm.value.membershipStartDate,

  //     membershipEndDate: this.memberForm.value.membershipEndDate || null,

  //     amount: this.memberForm.value.amount,

  //     paymentMethod: this.memberForm.value.paymentMethod,

  //     emergencyContactName: this.memberForm.value.emergencyContactName,

  //     emergencyRelationship: this.memberForm.value.emergencyRelationship,

  //     emergencyContactNumber: this.memberForm.value.emergencyContactNumber,
  //   };

  //   console.log('Member data:', memberData);

  //   this.userService.createMember(memberData).subscribe({
  //     next: (response: any) => {
  //       console.log('Member created:', response);

  //       this.loading = false;

  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Member Added!',
  //         text: 'Member has been added successfully.',
  //         confirmButtonText: 'OK',
  //       }).then(() => {
  //         this.memberForm.reset();

  //         this.submitted = false;

  //         this.router.navigate(['/user/member-list']);
  //       });
  //     },

  //     error: (error) => {
  //       console.error('Create member failed:', error);

  //       this.loading = false;

  //       // API errors are handled
  //       // by the global error interceptor.
  //     },
  //   });
  // }

  addMember(): void {
    this.submitted = true;

    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }

    if (this.memberForm.value.paymentMethod === 'UPI') {
      this.startUpiPayment();
      return;
    }

    this.loading = true;
    this.loaderService.show();

    const memberData = {
      ...this.memberForm.value,
      password: this.memberForm.value.password || null,
      membershipEndDate: this.memberForm.value.membershipEndDate || null,
    };

    this.userService.createMember(memberData).subscribe({
      next: (response: any) => {
        console.log('Member created:', response);

        this.loading = false;
        this.loaderService.hide();

        Swal.fire({
          icon: 'success',
          title: 'Member Added!',
          text: 'Member has been added successfully.',
          confirmButtonText: 'OK',
        }).then(() => {
          this.memberForm.reset();
          this.submitted = false;
          this.router.navigate(['/user/member-list']);
        });
      },

      error: (error) => {
        console.error('Create member failed:', error);

        this.loading = false;
        this.loaderService.hide();
      },
    });
  }

  startUpiPayment(): void {
    this.loading = true;
    this.loaderService.show();

    this.userService
      .createPaymentOrder({
        membershipId: Number(this.memberForm.value.membershipId),
        amount: Number(this.memberForm.value.amount),
        email: this.memberForm.value.email.trim(),
      })
      .subscribe({
        next: (order: any) => {
          this.loaderService.hide();

          const options = {
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: 'GYM PRO',
            description: 'Gym Membership Payment',
            order_id: order.orderId,

            // Enable the available payment methods.
            method: {
              upi: true,
              card: true,
              netbanking: true,
              wallet: true,
            },

            prefill: {
              name: this.memberForm.value.name,
              email: this.memberForm.value.email,
              contact: this.memberForm.value.contactNumber,
            },

            handler: (payment: any) => {
              this.verifyPaymentAndCreateMember(payment, order.orderId);
            },

            modal: {
              ondismiss: () => {
                this.loading = false;
              },
            },

            theme: {
              color: '#111111',
            },
          };

          const checkout = new Razorpay(options);

          checkout.on('payment.failed', (response: any) => {
            this.loading = false;

            Swal.fire({
              icon: 'error',
              title: 'Payment Failed',
              text: response.error?.description || 'Payment could not be completed.',
            });
          });

          checkout.open();
        },

        error: (error: any) => {
          console.error('Could not create payment order:', error);

          this.loading = false;
          this.loaderService.hide();

          Swal.fire({
            icon: 'warning',
            title: error.status === 409 ? 'Email Already Registered' : 'Order Creation Failed',
            text:
              error?.error?.message ||
              error?.message ||
              'Unable to create payment order. Please try again.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ed0712',
          });
        },
      });
  }

  verifyPaymentAndCreateMember(payment: any, orderId: string): void {
    this.loaderService.show();

    const memberData = {
      ...this.memberForm.value,
      password: this.memberForm.value.password || null,
      membershipEndDate: this.memberForm.value.membershipEndDate || null,
    };

    // Do not send confirmPassword to the backend.
    delete (memberData as any).confirmPassword;

    const request = {
      memberData,
      razorpayOrderId: orderId,
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpaySignature: payment.razorpay_signature,
    };

    this.userService.verifyPaymentAndCreateMember(request).subscribe({
      next: () => {
        this.loaderService.hide();
        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Member Added!',
          text: 'Payment verified and member registered successfully.',
        }).then(() => {
          this.memberForm.reset();
          this.submitted = false;
          this.router.navigate(['/user/member-list']);
        });
      },

      error: (error: any) => {
        console.error('Payment verification failed:', error);
        this.loaderService.hide();
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Registration Pending',
          text: 'We could not confirm the payment. Please check the transaction status before trying again.',
        });
      },
    });
  }

  // loadMembershipPlans(): void {
  //   this.loadingPlans = true;
  //   this.planError = '';

  //   this.userService.getMembershipPlans().subscribe({
  //     next: (response: any[]) => {
  //       this.membershipPlans = response;
  //       this.loadingPlans = false;
  //       console.log('Membership plans:', response);
  //     },
  //     error: (error) => {
  //       console.error('Error loading membership plans:', error);
  //       this.planError = 'Unable to load membership plans.';
  //       this.loadingPlans = false;
  //     },
  //   });
  // }

  loadMembershipPlans(): void {
    this.loadingPlans = true;
    this.planError = '';

    this.loaderService.show();

    this.userService.getMembershipPlans().subscribe({
      next: (response: any[]) => {
        this.membershipPlans = response;
        this.loadingPlans = false;
        this.loaderService.hide();

        console.log('Membership plans:', response);
      },

      error: (error) => {
        console.error('Error loading membership plans:', error);

        this.planError = 'Unable to load membership plans.';
        this.loadingPlans = false;
        this.loaderService.hide();
      },
    });
  }

  // Cancel
  cancel(): void {
    this.memberForm.reset();

    this.submitted = false;

    this.router.navigate(['/user/member-list']);
  }

  // Back
  goBack(): void {
    this.router.navigate(['/user/member-list']);
  }
}
