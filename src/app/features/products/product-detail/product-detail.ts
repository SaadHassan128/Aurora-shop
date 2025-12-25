import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FakeStoreService, Product } from '../../../core/services/fake-store.service';
import { CartService } from '../../../core/services/cart.service';
import { RecentlyViewedService } from '../../../core/services/recently-viewed.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import {
  LucideAngularModule,
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RefreshCw,
} from 'lucide-angular';
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';
import { SizeGuideComponent } from '../../../shared/components/size-guide/size-guide.component';
import { Ruler, BarChart2 } from 'lucide-angular';
import { ComparisonService } from '../../../core/services/comparison.service';

@Component({
    selector: 'app-product-detail',
    imports: [
        CommonModule,
        RouterLink,
        LucideAngularModule,
        ProductCardComponent,
        ProductReviewsComponent,
        SizeGuideComponent,
    ],
    templateUrl: './product-detail.html',
    styles: [
        `
      :host {
        display: block;
        min-height: 100vh;
      }
    `,
    ]
})
export class ProductDetailComponent implements OnInit {
  @Input() id!: string; // From route param

  private storeService = inject(FakeStoreService);
  private cartService = inject(CartService);
  private recentlyViewedService = inject(RecentlyViewedService);
  private toastr = inject(ToastrService);
  private wishlistService = inject(WishlistService);
  private comparisonService = inject(ComparisonService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  recentlyViewed = this.recentlyViewedService.recentlyViewed;
  isLoading = signal<boolean>(true);
  quantity = signal<number>(1);
  activeImage = signal<string>(''); // For gallery if we had multiple images

  // Size selection
  selectedSize = signal<string>('');
  availableSizes = ['XS', 'S', 'M', 'L', 'XL'];
  showSizeGuide = signal<boolean>(false);

  // Icons
  readonly Star = Star;
  readonly Ruler = Ruler;
  readonly ShoppingCart = ShoppingCart;
  readonly Heart = Heart;
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly ArrowLeft = ArrowLeft;
  readonly Truck = Truck;
  readonly ShieldCheck = ShieldCheck;
  readonly RefreshCw = RefreshCw;
  readonly BarChart2 = BarChart2;

  // Computed
  isInWishlist = computed(() => {
    const p = this.product();
    return p ? this.wishlistService.isInWishlist(p.id) : false;
  });

  isInCompare = computed(() => {
    const p = this.product();
    return p ? this.comparisonService.isInCompare(p.id) : false;
  });

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    if (!this.id) return;

    this.isLoading.set(true);
    const productId = parseInt(this.id);

    this.storeService.getProduct(productId).subscribe({
      next: (data) => {
        this.product.set(data);
        this.activeImage.set(data.image);
        this.recentlyViewedService.addProduct(data);
        this.loadRelated(data.category);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.isLoading.set(false);
        this.toastr.error('Failed to load product details');
      },
    });
  }

  loadRelated(category: string) {
    this.storeService.getProductsByCategory(category).subscribe({
      next: (data) => {
        // Filter out current product and limit to 4
        const related = data.filter((p) => p.id !== this.product()?.id).slice(0, 4);
        this.relatedProducts.set(related);
      },
    });
  }

  updateQuantity(delta: number) {
    const newQty = this.quantity() + delta;
    if (newQty >= 1) {
      this.quantity.set(newQty);
    }
  }

  addToCart() {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product, this.quantity());
      this.toastr.success('Added to cart', product.title);
    }
  }

  toggleWishlist() {
    const product = this.product();
    if (product) {
      this.wishlistService.toggleWishlist(product);
    }
  }

  toggleCompare() {
    const product = this.product();
    if (product) {
      if (this.isInCompare()) {
        this.comparisonService.removeFromCompare(product.id);
      } else {
        this.comparisonService.addToCompare(product);
      }
    }
  }

  handleImageError(event: any) {
    event.target.src = 'https://placehold.co/600x800?text=Product+Image';
  }
}
