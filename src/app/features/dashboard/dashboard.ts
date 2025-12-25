import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { FakeStoreService } from '../../core/services/fake-store.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { WishlistService } from '../../core/services/wishlist.service';
import { EGYPT_CITIES } from '../../core/constants/egypt-data';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LucideAngularModule,
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  MapPin,
  Bell,
  Camera,
} from 'lucide-angular';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, LucideAngularModule, ProductCardComponent, ReactiveFormsModule],
    templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private storeService = inject(FakeStoreService);
  wishlistService = inject(WishlistService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  user = this.authService.currentUser;
  activeTab = signal<'overview' | 'orders' | 'wishlist' | 'settings'>('overview');
  previewUrl = signal<string | null>(null);
  showWelcomeModal = false;

  showExploreModal = false;

  egyptCities = EGYPT_CITIES;

  readonly User = User;
  readonly Package = Package;
  readonly Heart = Heart;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly LayoutDashboard = LayoutDashboard;
  readonly ShoppingBag = ShoppingBag;
  readonly MapPin = MapPin;
  readonly Bell = Bell;
  readonly Camera = Camera;

  settingsForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.settingsForm.patchValue({
          firstName: u.name.firstname,
          lastName: u.name.lastname,
          email: u.email,
          phone: u.phone,
          address: {
            street: u.address.street,
            city: u.address.city,
            zipcode: u.address.zipcode,
          },
        });

        // Set preview URL if exists
        if (u.photoUrl) {
          this.previewUrl.set(u.photoUrl);
        }
      }
    });

    // Check for welcome query param
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (params['welcome'] === 'true') {
        this.showWelcomeModal = true;
        // Remove query param without reloading
        this.router.navigate([], {
          queryParams: { welcome: null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    });
  }

  // Mock Data
  stats = [
    {
      label: 'Total Orders',
      value: '12',
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Wishlist',
      value: '0',
      icon: Heart,
      color: 'text-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-900/20',
    },
    {
      label: 'Total Spent',
      value: '$1,240',
      icon: CreditCard,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  orders = signal<any[]>([]);

  wishlistItems = this.wishlistService.wishlistItems;

  ngOnInit() {
    // Load orders from local storage
    this.loadOrders();

    // Update stats with real wishlist count
    this.stats[1].value = this.wishlistService.count().toString();
  }

  handleProfileImageError(event: any) {
    event.target.src = 'https://placehold.co/200x200?text=User';
  }

  completeProfile() {
    this.showWelcomeModal = false;
    this.setActiveTab('settings');
  }

  closeWelcomeModal() {
    this.showWelcomeModal = false;
  }

  loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      this.orders.set(parsedOrders);

      // Update stats based on real orders
      this.stats[0].value = parsedOrders.length.toString();

      const totalSpent = parsedOrders.reduce((acc: number, order: any) => acc + order.total, 0);
      this.stats[2].value = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(totalSpent);
    } else {
      // Initialize with 0 if no orders
      this.stats[0].value = '0';
      this.stats[2].value = '$0.00';
    }
  }

  setActiveTab(tab: 'overview' | 'orders' | 'wishlist' | 'settings') {
    this.activeTab.set(tab);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  }

  logout() {
    this.authService.logout();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        this.toastr.error('File size too large. Max 5MB.', 'Error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  closeExploreModal() {
    this.showExploreModal = false;
  }

  exploreProducts() {
    this.showExploreModal = false;
    this.router.navigate(['/products']);
  }

  saveSettings() {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      this.toastr.error('Please check your inputs', 'Invalid Form');
      return;
    }

    const formValue = this.settingsForm.value;

    this.authService.updateProfile({
      email: formValue.email!,
      phone: formValue.phone!,
      photoUrl: this.previewUrl()!, // Save the photo URL
      name: {
        firstname: formValue.firstName!,
        lastname: formValue.lastName!,
      },
      address: {
        ...this.user()!.address,
        street: formValue.address?.street!,
        city: formValue.address?.city!,
        zipcode: formValue.address?.zipcode!,
      },
    });

    this.toastr.success('Profile updated successfully', 'Settings Saved');

    // Show Explore Modal if user came from welcome flow
    // We can check if they just updated their profile for the first time or similar
    // For now, we'll just show it after any successful save
    this.showExploreModal = true;
  }
}
