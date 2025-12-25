import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComparisonService } from '../../../core/services/comparison.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { LucideAngularModule, X, ShoppingCart, Star, ArrowLeft, BarChart2 } from 'lucide-angular';
import { Product } from '../../../core/services/fake-store.service';

@Component({
    selector: 'app-product-comparison',
    imports: [CommonModule, RouterLink, LucideAngularModule],
    template: `
    <div class="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <a
            routerLink="/"
            class="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-2 transition-colors"
          >
            <lucide-icon [img]="ArrowLeft" [size]="16"></lucide-icon>
            Back to Shopping
          </a>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Product Comparison</h1>
          <p class="text-slate-600 dark:text-slate-400 mt-1">
            Comparing {{ service.count() }} products
          </p>
        </div>

        <button
          *ngIf="service.count() > 0"
          (click)="service.clearCompare()"
          class="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-bold border border-red-200 dark:border-red-900/50"
        >
          Clear All
        </button>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="service.count() === 0"
        class="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800"
      >
        <div
          class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <lucide-icon [img]="BarChart2" [size]="40" class="text-slate-400"></lucide-icon>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          No products to compare
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          Add items to your comparison list to see them side by side.
        </p>
        <a
          routerLink="/products"
          class="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors inline-block"
        >
          Browse Products
        </a>
      </div>

      <!-- Comparison Table -->
      <div *ngIf="service.count() > 0" class="overflow-x-auto pb-4">
        <div
          class="min-w-[800px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <table class="w-full">
            <thead>
              <tr
                class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800"
              >
                <th class="p-6 text-left w-48 text-slate-500 dark:text-slate-400 font-medium">
                  Product
                </th>
                <th
                  *ngFor="let product of service.compareList()"
                  class="p-6 relative min-w-[250px]"
                >
                  <button
                    (click)="service.removeFromCompare(product.id)"
                    class="absolute top-4 right-4 p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <lucide-icon [img]="X" [size]="16"></lucide-icon>
                  </button>
                  <div class="h-40 flex items-center justify-center mb-4 p-4 bg-white rounded-xl">
                    <img
                      [src]="product.image"
                      [alt]="product.title"
                      class="max-h-full object-contain"
                    />
                  </div>
                  <h3
                    class="font-bold text-slate-900 dark:text-white line-clamp-2 h-12 mb-2 text-center"
                  >
                    <a
                      [routerLink]="['/products', product.id]"
                      class="hover:text-primary transition-colors"
                    >
                      {{ product.title }}
                    </a>
                  </h3>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
              <!-- Price -->
              <tr>
                <td
                  class="p-6 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20"
                >
                  Price
                </td>
                <td *ngFor="let product of service.compareList()" class="p-6 text-center">
                  <span class="text-xl font-bold text-primary">{{ product.price | currency }}</span>
                </td>
              </tr>

              <!-- Rating -->
              <tr>
                <td
                  class="p-6 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20"
                >
                  Rating
                </td>
                <td *ngFor="let product of service.compareList()" class="p-6 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <lucide-icon
                      [img]="Star"
                      [size]="16"
                      class="fill-yellow-400 text-yellow-400"
                    ></lucide-icon>
                    <span class="font-bold text-slate-900 dark:text-white">{{
                      product.rating.rate
                    }}</span>
                    <span class="text-slate-400 text-sm">({{ product.rating.count }} reviews)</span>
                  </div>
                </td>
              </tr>

              <!-- Category -->
              <tr>
                <td
                  class="p-6 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20"
                >
                  Category
                </td>
                <td
                  *ngFor="let product of service.compareList()"
                  class="p-6 text-center capitalize text-slate-600 dark:text-slate-400"
                >
                  {{ product.category }}
                </td>
              </tr>

              <!-- Description -->
              <tr>
                <td
                  class="p-6 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20"
                >
                  Description
                </td>
                <td
                  *ngFor="let product of service.compareList()"
                  class="p-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-center"
                >
                  <p class="line-clamp-4">{{ product.description }}</p>
                </td>
              </tr>

              <!-- Action -->
              <tr>
                <td
                  class="p-6 font-bold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20"
                ></td>
                <td *ngFor="let product of service.compareList()" class="p-6 text-center">
                  <button
                    (click)="addToCart(product)"
                    class="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <lucide-icon [img]="ShoppingCart" [size]="18"></lucide-icon>
                    Add to Cart
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ProductComparisonComponent {
  service = inject(ComparisonService);
  cartService = inject(CartService);
  toastr = inject(ToastrService);

  readonly X = X;
  readonly ShoppingCart = ShoppingCart;
  readonly Star = Star;
  readonly ArrowLeft = ArrowLeft;
  readonly BarChart2 = BarChart2;

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastr.success('Added to cart', product.title);
  }
}
