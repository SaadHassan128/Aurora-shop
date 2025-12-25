import { Component, inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
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
    ]
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

  // Countdown timer logic
  timeLeft = { hours: 10, minutes: 45, seconds: 30 };
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
        if (this.timeLeft.seconds > 0) {
          this.timeLeft.seconds--;
        } else {
          if (this.timeLeft.minutes > 0) {
            this.timeLeft.minutes--;
            this.timeLeft.seconds = 59;
          } else {
            if (this.timeLeft.hours > 0) {
              this.timeLeft.hours--;
              this.timeLeft.minutes = 59;
              this.timeLeft.seconds = 59;
            } else {
              // Reset timer for demo loop
              this.timeLeft = { hours: 10, minutes: 45, seconds: 30 };
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
