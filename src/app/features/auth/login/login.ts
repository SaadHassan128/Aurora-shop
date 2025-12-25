import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule, Lock, User, Key, Eye, EyeOff, LogIn, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  // Icons
  readonly Lock = Lock;
  readonly User = User;
  readonly Key = Key;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly LogIn = LogIn;
  readonly Loader2 = Loader2;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isLoading = signal(false);
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { username, password } = this.loginForm.value;

      this.authService.login({ username: username!, password: password! }).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.toastr.success('Welcome back!', 'Login Successful');

          if (response.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toastr.error('Invalid credentials. Please try again.', 'Login Failed');
        },
      });
    }
  }
}
