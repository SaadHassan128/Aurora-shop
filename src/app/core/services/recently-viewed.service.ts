import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from './fake-store.service';

@Injectable({
  providedIn: 'root',
})
export class RecentlyViewedService {
  private readonly STORAGE_KEY = 'aurora_recently_viewed';
  private readonly MAX_ITEMS = 8;
  private platformId = inject(PLATFORM_ID);

  recentlyViewed = signal<Product[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.recentlyViewed.set(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse recently viewed products', e);
          this.recentlyViewed.set([]);
        }
      }
    }
  }

  addProduct(product: Product) {
    const current = this.recentlyViewed();
    // Remove if already exists to move it to the top
    const filtered = current.filter((p) => p.id !== product.id);

    // Add to beginning
    const updated = [product, ...filtered].slice(0, this.MAX_ITEMS);

    this.recentlyViewed.set(updated);
    this.saveToStorage(updated);
  }

  private saveToStorage(products: Product[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }
  }

  clear() {
    this.recentlyViewed.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
