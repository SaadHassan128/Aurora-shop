import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../core/services/fake-store.service';
import {
  LucideAngularModule,
  Heart,
  ShoppingCart,
  Star,
  Eye,
  Check,
  BarChart2,
} from 'lucide-angular';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ComparisonService } from '../../../core/services/comparison.service';

@Component({
    selector: 'app-product-card',
    imports: [CommonModule, RouterLink, LucideAngularModule],
    templateUrl: './product-card.html',
    styleUrls: ['./product-card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product: Product | null = null;
  @Input() isLoading = false;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();

  private wishlistService = inject(WishlistService);
  private comparisonService = inject(ComparisonService);
  private router = inject(Router);

  readonly Heart = Heart;
  readonly ShoppingCart = ShoppingCart;
  readonly Star = Star;
  readonly Eye = Eye;
  readonly Check = Check;
  readonly BarChart2 = BarChart2;

  isAdded = signal(false);

  isInWishlist(product: Product | null): boolean {
    if (!product) return false;
    return this.wishlistService.isInWishlist(product.id);
  }

  isInCompare(product: Product | null): boolean {
    if (!product) return false;
    return this.comparisonService.isInCompare(product.id);
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.product) {
      this.isAdded.set(true);
      this.addToCart.emit(this.product);

      // Reset button state after 2 seconds
      setTimeout(() => {
        this.isAdded.set(false);
      }, 2000);
    }
  }

  onToggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.product) {
      // We can emit the event for parent handling OR handle it directly here.
      // Given the requirement for a consistent wishlist service, let's handle it here
      // but also emit it in case the parent wants to know (optional).
      this.wishlistService.toggleWishlist(this.product);
      this.toggleWishlist.emit(this.product);
    }
  }

  onToggleCompare(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.product) {
      if (this.comparisonService.isInCompare(this.product.id)) {
        this.comparisonService.removeFromCompare(this.product.id);
      } else {
        this.comparisonService.addToCompare(this.product);
      }
    }
  }

  navigateToProduct() {
    if (this.product) {
      this.router.navigate(['/products', this.product.id]);
    }
  }

  handleImageError(event: any) {
    event.target.src = 'https://placehold.co/400x600?text=Product+Image';
  }
}
