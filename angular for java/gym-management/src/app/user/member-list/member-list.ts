import { routes } from './../../app.routes';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service/user-service';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../shared/loader/loader';
import { Loaderservice } from '../../shared/service/loaderservice';

@Component({
  selector: 'app-member-list',
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  members: any[] = [];

  search = '';
  status = '';
  // paymentStatus = '';

  currentPage = 0;
  pageSize = 5;

  totalElements = 0;
  totalPages = 0;

  loading = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private routes: Router,
    private loaderService: Loaderservice,
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  currentMonthLabel = new Date().toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  loadMembers(): void {
    this.loading = true;
    this.loaderService.show();
    this.errorMessage = '';

    this.userService
      .getAllUsers(
        this.currentPage,
        this.pageSize,
        this.search,
        this.status,
        // this.paymentStatus
      )
      .subscribe({
        next: (response: any) => {
          this.members = response.content ?? [];
          this.totalElements = response.totalElements ?? 0;
          this.totalPages = response.totalPages ?? 0;

          this.loading = false;
          this.loaderService.hide();
        },
        error: (error) => {
          console.error('Error loading members:', error);

          this.members = [];
          this.totalElements = 0;
          this.totalPages = 0;
          this.errorMessage = 'Unable to load members. Please try again.';

          this.loading = false;
          this.loaderService.hide();
        },
      });
  }

  // Search button
  onSearch(): void {
    this.currentPage = 0;
    this.loadMembers();
  }

  // Apply membership status filter
  onStatusChange(): void {
    this.currentPage = 0;
    this.loadMembers();
  }

  // Apply payment status filter
  onPaymentStatusChange(): void {
    this.currentPage = 0;
    this.loadMembers();
  }

  // Reset all filters
  resetFilters(): void {
    this.search = '';
    this.status = '';
    // this.paymentStatus = '';
    this.currentPage = 0;

    this.loadMembers();
  }

  // Go to a selected page
  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.loadMembers();
  }

  // Previous page
  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // Next page
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // Page numbers for pagination buttons
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  editUSer(id: number): void {
    this.routes.navigate(['user/member-details', id]);
  }
  userDetails(id: number): void {
    this.routes.navigate(['user/member-payment-details', id]);
  }
}
