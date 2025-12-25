import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  User,
  Mail,
  Phone,
  Lock,
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
    templateUrl: './register.html',
    styleUrls: ['./register.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // UI State
  currentStep = signal(1);
  totalSteps = 3;
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);
  profileImagePreview = signal<string | null>(null);

  // Icons
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Lock = Lock;
  readonly Upload = Upload;
  readonly Check = Check;
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  registerForm: FormGroup = this.fb.group({
    personal: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
    }),
    security: this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    ),
    profile: this.fb.group({
      avatar: [null],
    }),
  });

  get personal() {
    return this.registerForm.get('personal') as FormGroup;
  }
  get security() {
    return this.registerForm.get('security') as FormGroup;
  }
  get profile() {
    return this.registerForm.get('profile') as FormGroup;
  }

  passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
    const password = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  nextStep() {
    const currentGroup = this.getCurrentGroup();
    if (currentGroup.valid) {
      this.currentStep.update((s) => Math.min(s + 1, this.totalSteps));
    } else {
      currentGroup.markAllAsTouched();
      this.toastr.warning('Please fill in all required fields correctly.');
    }
  }

  prevStep() {
    this.currentStep.update((s) => Math.max(s - 1, 1));
  }

  getCurrentGroup(): FormGroup {
    switch (this.currentStep()) {
      case 1:
        return this.personal;
      case 2:
        return this.security;
      case 3:
        return this.profile;
      default:
        return this.personal;
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Simulate upload/preview
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview.set(reader.result as string);
        this.profile.patchValue({ avatar: file });
      };
      reader.readAsDataURL(file);
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);

      const formData = {
        ...this.personal.value,
        ...this.security.value,
        // In real app, handle file upload separately or as multipart/form-data
      };

      // Simulate API call
      setTimeout(() => {
        console.log('Register Data:', formData);

        // Mock registration in AuthService
        this.authService
          .register({
            email: formData.email,
            username: formData.email.split('@')[0], // Generate username from email
            password: formData.password,
            name: {
              firstname: formData.firstName,
              lastname: formData.lastName,
            },
            address: {
              city: 'Cairo', // Default
              street: 'Main Street',
              number: 1,
              zipcode: '12345',
              geolocation: { lat: '0', long: '0' },
            },
            phone: formData.phone,
            photoUrl: this.profileImagePreview(), // Pass the image preview as URL for mock
          })
          .subscribe({
            next: () => {
              this.isLoading.set(false);
              this.toastr.success('Account created successfully!', 'Welcome');
              // Navigate to dashboard with welcome flag
              this.router.navigate(['/dashboard'], { queryParams: { welcome: 'true' } });
            },
            error: () => {
              this.isLoading.set(false);
              this.toastr.error('Registration failed');
            },
          });
      }, 1500);
    } else {
      this.registerForm.markAllAsTouched();
      this.toastr.error('Please fix the errors in the form.');
    }
  }

  getPasswordStrength(): number {
    const password = this.security.get('password')?.value || '';
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[@$!%*?&]/.test(password)) strength += 20;

    return strength;
  }

  getStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 40) return 'bg-red-500';
    if (strength <= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getStrengthLabel(): string {
    const strength = this.getPasswordStrength();
    if (strength === 0) return '';
    if (strength <= 40) return 'Weak';
    if (strength <= 80) return 'Medium';
    return 'Strong';
  }
}
