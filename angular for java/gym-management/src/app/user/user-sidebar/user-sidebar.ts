import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-sidebar.html',
  styleUrl: './user-sidebar.css',
})
export class UserSidebar {
  isCollapsed = false;

  @Input() isMobileOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();
  constructor(private router: Router) {}

  // =========================
  // DESKTOP COLLAPSE
  // =========================

  toggleSidebar(): void {
    if (window.innerWidth > 768) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  // =========================
  // CLOSE MOBILE SIDEBAR
  // =========================

  closeMobileSidebar(): void {
    if (window.innerWidth <= 768) {
      this.closeSidebar.emit();
    }
  }

  // =========================
  // LOGOUT
  // =========================

 logout(): void {
  Swal.fire({
    icon: 'warning',
    title: 'Are you sure?',
    text: 'Do you want to logout from your account?',
    showCancelButton: true,
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'No, Stay',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');

      this.router.navigate(['/login']);
    }
  });
}

  // =========================
  // RESPONSIVE
  // =========================

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768) {
      this.closeSidebar.emit();
    }
  }
}
