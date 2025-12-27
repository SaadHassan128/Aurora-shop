import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import {
  LucideAngularModule,
  ChevronDown,
  ArrowRight,
  Heart,
  Eye,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Timer,
  Zap,
} from 'lucide-angular';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterLink, LucideAngularModule, ProductCardComponent],
    templateUrl: './home.html',
    styles: [
        `
      @keyframes scale-slow {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.1);
        }
      }
      .animate-scale-slow {
        animation: scale-slow 20s linear infinite alternate;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  api = inject(ApiService);
  cartService = inject(CartService);
  toastr = inject(ToastrService);
  recentlyViewedService = inject(RecentlyViewedService);
  private platformId = inject(PLATFORM_ID);

  recentlyViewed = this.recentlyViewedService.recentlyViewed;

  // Icons
  readonly ChevronDown = ChevronDown;
  readonly ArrowRight = ArrowRight;
  readonly Heart = Heart;
  readonly Eye = Eye;
  readonly Star = Star;
  readonly Truck = Truck;
  readonly ShieldCheck = ShieldCheck;
  readonly RefreshCw = RefreshCw;
  readonly Headphones = Headphones;
  readonly Timer = Timer;
  readonly Zap = Zap;

  // Fetch only 4 products for featured
  featuredProducts = toSignal(this.api.get<Product[]>('/products?limit=4'));

  // Flash sale products (using different limit/sort to vary)
  flashSaleProducts = toSignal(this.api.get<Product[]>('/products?limit=4&sort=desc'));

  // Countdown timer logic - using signal for better performance with OnPush
  timeLeft = signal({ hours: 10, minutes: 45, seconds: 30 });
  private timerInterval: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    if (isPlatformBrowser(this.platformId)) {
      this.timerInterval = setInterval(() => {
        const current = this.timeLeft();
        if (current.seconds > 0) {
          this.timeLeft.set({ ...current, seconds: current.seconds - 1 });
        } else {
          if (current.minutes > 0) {
            this.timeLeft.set({ ...current, minutes: current.minutes - 1, seconds: 59 });
          } else {
            if (current.hours > 0) {
              this.timeLeft.set({ hours: current.hours - 1, minutes: 59, seconds: 59 });
            } else {
              // Reset timer for demo loop
              this.timeLeft.set({ hours: 10, minutes: 45, seconds: 30 });
            }
          }
        }
      }, 1000);
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastr.success('Added to cart', product.title);
  }
}
