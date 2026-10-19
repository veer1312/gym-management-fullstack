import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service/user-service';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../../shared/loader/loader';
import { Loaderservice } from '../../shared/service/loaderservice';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  showPassword = false;
  loading = false;
  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private loaderService: Loaderservice,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();

    Swal.fire({
      icon: 'warning',
      title: 'Invalid Input',
      text: 'Please enter a valid email and password.',
      confirmButtonText: 'OK',
    });

    return;
  }

  this.loading = true;
  this.loaderService.show();

  const loginData = {
    email: this.loginForm.value.email,
    password: this.loginForm.value.password,
  };

  this.userService.login(loginData).subscribe({
    next: (response: any) => {
      this.loading = false;
      this.loaderService.hide();

      localStorage.setItem('token', response.authToken);
      localStorage.setItem('userName', response.name);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${response.name}!`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        this.router.navigate(['/user/dashboard']);
      });
    },

    error: (error) => {
      this.loading = false;
      this.loaderService.hide();

      console.error('Login failed:', error);

      let errorMessage = 'Invalid email or password.';

      if (error.status === 401) {
        errorMessage = 'Invalid email or password.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        confirmButtonText: 'Try Again',
      });
    },
  });
}
}
