import { Component, inject, signal, computed, PLATFORM_ID, OnInit, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { EGYPT_CITIES } from '../../core/constants/egypt-data';
import {
  LucideAngularModule,
  Check,
  CreditCard,
  Truck,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Loader2,
} from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-checkout',
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './checkout.html'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);

  // Signals
  currentStep = signal(1);
  cartItems = toSignal(this.cartService.cartItems$, { initialValue: [] });
  cartTotal = toSignal(this.cartService.cartTotal$, { initialValue: 0 });
  isProcessing = signal(false);

  user = this.authService.currentUser;

  // Icons
  readonly Check = Check;
  readonly CreditCard = CreditCard;
  readonly Truck = Truck;
  readonly ShoppingBag = ShoppingBag;
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;
  readonly ShieldCheck = ShieldCheck;
  readonly Loader2 = Loader2;

  // Form
  checkoutForm = this.fb.group({
    shipping: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['Egypt', Validators.required],
      phoneCountry: ['EG', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    }),
    payment: this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^(\d{4}\s?){4}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardHolder: ['', Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.checkoutForm.patchValue({
          shipping: {
            firstName: u.name.firstname,
            lastName: u.name.lastname,
            email: u.email,
            phone: u.phone,
            address: u.address.street,
            city: u.address.city,
            zipCode: u.address.zipcode,
          },
        });
      }
    });
  }

  // ... existing code ...

  formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    input.value = value;
    this.paymentGroup?.get('expiry')?.setValue(value, { emitEvent: false });
  }

  // ... existing code ...

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    value = value.substring(0, 16); // Limit to 16 digits

    // Add space every 4 digits
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }

    const formattedValue = parts.join(' ');
    input.value = formattedValue;

    // Update form control value
    this.paymentGroup?.get('cardNumber')?.setValue(formattedValue, { emitEvent: false });
  }

  countries = [{ code: 'EG', name: 'Egypt', flag: '🇪🇬', phone: '+20' }];

  egyptCities = EGYPT_CITIES;

  get selectedCountryPhone() {
    const countryCode = this.shippingGroup?.get('phoneCountry')?.value;
    return this.countries.find((c) => c.code === countryCode)?.phone || '';
  }

  get shippingGroup() {
    return this.checkoutForm.get('shipping');
  }

  get paymentGroup() {
    return this.checkoutForm.get('payment');
  }

  nextStep() {
    if (this.currentStep() === 1 && this.shippingGroup?.valid) {
      this.currentStep.set(2);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    } else if (this.currentStep() === 2 && this.paymentGroup?.valid) {
      this.currentStep.set(3);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    } else {
      this.checkoutForm.markAllAsTouched();
      this.toastr.warning('Please fill in all required fields correctly');
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => s - 1);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    }
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.toastr.error('Please complete all required fields', 'Invalid Form');
      return;
    }

    this.isProcessing.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isProcessing.set(false);

      // Save order to history (mock)
      const order = {
        id: Math.floor(Math.random() * 100000),
        date: new Date(),
        total: this.cartTotal(),
        status: 'Processing',
        items: this.cartItems(),
      };

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.unshift(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart
      this.cartService.clearCart();

      // Show success modal
      this.showSuccessModal = true;
    }, 2000);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  handleImageError(event: any) {
    event.target.src = 'https://placehold.co/100x100?text=Product';
  }

  showSuccessModal = false;
}
