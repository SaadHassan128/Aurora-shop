import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from './fake-store.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly STORAGE_KEY = 'aurora_wishlist';
  private platformId = inject(PLATFORM_ID);

  // Signal to hold wishlist items
  wishlistItems = signal<Product[]>([]);

  // Computed signal for count
  count = computed(() => this.wishlistItems().length);

  constructor(private toastr: ToastrService) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.wishlistItems.set(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse wishlist', e);
          this.wishlistItems.set([]);
        }
      }
    }
  }

  private saveToStorage(items: Product[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems().some((p) => p.id === productId);
  }

  toggleWishlist(product: Product) {
    const currentItems = this.wishlistItems();
    const exists = currentItems.some((p) => p.id === product.id);

    if (exists) {
      const updated = currentItems.filter((p) => p.id !== product.id);
      this.wishlistItems.set(updated);
      this.saveToStorage(updated);
      this.toastr.info('Removed from wishlist', 'Wishlist Updated');
    } else {
      const updated = [...currentItems, product];
      this.wishlistItems.set(updated);
      this.saveToStorage(updated);
      this.toastr.success('Added to wishlist', 'Wishlist Updated');
    }
  }

  addToWishlist(product: Product) {
    if (!this.isInWishlist(product.id)) {
      this.toggleWishlist(product);
    }
  }

  removeFromWishlist(productId: number) {
    const currentItems = this.wishlistItems();
    const product = currentItems.find((p) => p.id === productId);
    if (product) {
      this.toggleWishlist(product);
    }
  }
}
