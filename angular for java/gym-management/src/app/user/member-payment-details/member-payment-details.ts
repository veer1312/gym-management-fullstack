import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Payment } from '../../services/payment/payment';
import { LoaderComponent } from '../../shared/loader/loader';
import { Loaderservice } from '../../shared/service/loaderservice';

interface PaymentResponse {
  id: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  membership?: string | null;
}

interface UserPaymentResponse {
  userId: number;
  userName: string;
  email: string;
  contactNumber: string;
  gender?: string;
  dateOfBirth?: string;
  address: string;
  membershipId: number;
  membership?: string | null;
  membershipStartDate: string;
  membershipEndDate?: string | null;
  payments: PaymentResponse[];
}

@Component({
  selector: 'app-member-payment-details',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './member-payment-details.html',
  styleUrl: './member-payment-details.css',
})
export class MemberPaymentDetails implements OnInit {
  member: UserPaymentResponse | null = null;
  payments: PaymentResponse[] = [];
  paginatedPayments: PaymentResponse[] = [];

  loading = false;
  errorMessage = '';

  currentPage = 1;
  pageSize = 5;

  constructor(
    private route: ActivatedRoute,
    private paymentService: Payment,
    private location: Location,
    private loaderService: Loaderservice,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!id || !Number.isInteger(id) || id < 1) {
        this.errorMessage = 'Invalid member ID.';
        return;
      }

      this.loadMemberDetails(id);
    });
  }

  loadMemberDetails(id: number): void {
    this.loaderService.show();
    this.errorMessage = '';

    this.paymentService.getPaymentById(id).subscribe({
      next: (response: UserPaymentResponse) => {
        this.member = response;

        this.payments = [...(response.payments ?? [])].sort(
          (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
        );

        this.currentPage = 1;
        this.updatePagination();

        this.loaderService.hide();
      },

      error: (error) => {
        console.error('Error loading member details:', error);

        this.errorMessage =
          error.status === 404
            ? 'Member not found.'
            : 'Unable to load member details. Please try again.';

        this.loaderService.hide();
      },
    });
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    this.paginatedPayments = this.payments.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.payments.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get startRecord(): number {
    return this.payments.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.payments.length);
  }

  get totalPaid(): number {
    return this.payments.reduce((total, payment) => total + Number(payment.amount || 0), 0);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.updatePagination();
  }

  getMembershipName(membership?: string | null, membershipId?: number): string {
    if (membership) {
      return membership;
    }

    const plans: Record<number, string> = {
      1: 'Monthly',
      2: 'Quarterly',
      3: 'Half-Yearly',
      4: 'Yearly',
    };

    return membershipId ? (plans[membershipId] ?? 'Unknown') : 'N/A';
  }

  goBack(): void {
    this.location.back();
  }
}
