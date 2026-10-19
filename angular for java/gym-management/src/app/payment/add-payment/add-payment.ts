import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service/user-service';
import { Payment } from '../../services/payment/payment';
import Swal from 'sweetalert2';
import { Loaderservice } from '../../shared/service/loaderservice';
import { LoaderComponent } from '../../shared/loader/loader';

declare var Razorpay: any;
@Component({
  selector: 'app-add-payment',
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './add-payment.html',
  styleUrl: './add-payment.css',
})
export class AddPayment implements OnInit {
  paymentForm!: FormGroup;
  today = new Date();
  members: any[] = [];
  membershipPlans: any[] = [];

  submitted = false;
  loading = false;
  loadingMembers = false;
  loadingPlans = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private paymentService: Payment,
    private loaderService: Loaderservice,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadMembers();
    this.loadMembershipPlans();
  }

  initializeForm(): void {
    this.paymentForm = this.fb.group({
      userId: [null, Validators.required],
      membershipId: [null, Validators.required],
      membershipStartDate: ['', Validators.required],
      membershipEndDate: [''],
      amount: [null, [Validators.required, Validators.min(1)]],
      paymentMethod: ['', Validators.required],
    });
  }

  // Load existing members

  loadMembers(): void {
    this.loadingMembers = true;
    this.loaderService.show();

    this.userService.getAllUsers(0, 1000).subscribe({
      next: (response: any) => {
        console.log('Members API response:', response);

        // API now returns a direct array
        this.members = Array.isArray(response) ? response : (response?.content ?? []);

        this.loadingMembers = false;
        this.loaderService.hide();
      },
      error: (error: any) => {
        console.error('Error loading members:', error);

        this.members = [];
        this.loadingMembers = false;
        this.loaderService.hide();

        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Members',
          text: error?.error?.message || 'Unable to load members.',
        });
      },
    });
  }

  // Load membership plans
  loadMembershipPlans(): void {
    this.loading = true;
    this.loaderService.show();

    this.userService.getMembershipPlans().subscribe({
      next: (response: any[]) => {
        this.membershipPlans = response;
        this.loading = false;
        this.loaderService.hide();
      },
      error: (error: any) => {
        console.error('Error loading membership plans:', error);
        this.loading = false;
        this.loaderService.hide();
      },
    });
  }

  // Submit payment
  onSubmit(): void {
    this.submitted = true;

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.loaderService.show();

    const formValue = this.paymentForm.value;

    const paymentData = {
      userId: Number(formValue.userId),
      membershipId: Number(formValue.membershipId),
      membershipStartDate: formValue.membershipStartDate,
      membershipEndDate: formValue.membershipEndDate || null,
      amount: Number(formValue.amount),
      paymentMethod: formValue.paymentMethod,
    };

    if (paymentData.paymentMethod === 'UPI') {
      this.startRazorpayPayment(paymentData);
      return;
    }

    this.paymentService.createPayment(paymentData).subscribe({
      next: (response: any) => {
        console.log('Payment response:', response);

        if (response?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: response.message || 'Payment added successfully.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ed0712',
          });

          this.paymentForm.reset({
            userId: null,
            membershipId: null,
            membershipStartDate: '',
            membershipEndDate: '',
            amount: null,
            paymentMethod: '',
          });

          this.submitted = false;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: response?.message || 'Unable to add payment.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ed0712',
          });
        }

        this.loading = false;
        this.loaderService.hide();
      },

      error: (error: any) => {
        console.error('Error adding payment:', error);

        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: error?.error?.message || 'Unable to add payment. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ed0712',
        });

        this.loading = false;
        this.loaderService.hide();
      },
    });
  }

  startRazorpayPayment(paymentData: any): void {
    this.loading = true;
    this.loaderService.show();

    this.paymentService
      .createPaymentOrder({
        membershipId: paymentData.membershipId,
        amount: paymentData.amount,
      })
      .subscribe({
        next: (order: any) => {
          this.loaderService.hide();

          const member = this.getSelectedMember();

          const options = {
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: 'GYM PRO',
            description: 'Membership Payment',
            order_id: order.orderId,

            method: {
              upi: true,
              card: true,
              netbanking: true,
              wallet: true,
            },

            prefill: {
              name: member?.name ?? '',
              email: member?.email ?? '',
              contact: member?.contactNumber ?? '',
            },

            handler: (response: any) => {
              this.loaderService.show();

              this.paymentService
                .verifyPaymentAndAddPayment({
                  paymentData,
                  razorpayOrderId: order.orderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                })
                .subscribe({
                  next: (result: any) => {
                    this.loading = false;
                    this.loaderService.hide();

                    if (result?.success) {
                      Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        text: result.message || 'Payment recorded successfully.',
                        confirmButtonColor: '#ed0712',
                      });

                      this.paymentForm.reset({
                        userId: null,
                        membershipId: null,
                        membershipStartDate: '',
                        membershipEndDate: '',
                        amount: null,
                        paymentMethod: '',
                      });

                      this.submitted = false;
                    }
                  },
                  error: (error: any) => {
                    this.loading = false;
                    this.loaderService.hide();

                    Swal.fire({
                      icon: 'error',
                      title: 'Verification Failed',
                      text:
                        error?.error?.message ||
                        'Payment verification failed. Please contact support before retrying.',
                    });
                  },
                });
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
          console.error('Razorpay order creation failed:', error);

          this.loading = false;
          this.loaderService.hide();

          Swal.fire({
            icon: 'error',
            title: 'Unable to Start Payment',
            text: error?.error?.message || 'Please try again.',
          });
        },
      });
  }

  getSelectedMember(): any {
    const userId = this.paymentForm?.get('userId')?.value;

    if (!userId) {
      return null;
    }

    return this.members.find((member) => member.id === Number(userId));
  }

  getSelectedPlan(): any {
    const membershipId = this.paymentForm?.get('membershipId')?.value;

    if (!membershipId) {
      return null;
    }

    return this.membershipPlans.find((plan) => plan.id === Number(membershipId));
  }
}
