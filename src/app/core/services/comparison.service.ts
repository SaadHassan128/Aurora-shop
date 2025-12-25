import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/product.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ComparisonService {
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);

  // Max 4 products to compare
  private readonly MAX_PRODUCTS = 4;
  private readonly STORAGE_KEY = 'aurora_comparison';

  compareList = signal<Product[]>([]);

  count = computed(() => this.compareList().length);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.compareList.set(JSON.parse(saved));
      }
    }
  }

  private saveToStorage(products: Product[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }
  }

  addToCompare(product: Product) {
    const currentList = this.compareList();

    if (this.isInCompare(product.id)) {
      this.toastr.info('Product already in comparison list');
      return;
    }

    if (currentList.length >= this.MAX_PRODUCTS) {
      this.toastr.warning(`You can only compare up to ${this.MAX_PRODUCTS} products`);
      return;
    }

    const updatedList = [...currentList, product];
    this.compareList.set(updatedList);
    this.saveToStorage(updatedList);
    this.toastr.success('Added to comparison list');
  }

  removeFromCompare(productId: number) {
    const updatedList = this.compareList().filter((p) => p.id !== productId);
    this.compareList.set(updatedList);
    this.saveToStorage(updatedList);
    this.toastr.info('Removed from comparison list');
  }

  clearCompare() {
    this.compareList.set([]);
    this.saveToStorage([]);
    this.toastr.info('Comparison list cleared');
  }

  isInCompare(productId: number): boolean {
    return this.compareList().some((p) => p.id === productId);
  }
}
