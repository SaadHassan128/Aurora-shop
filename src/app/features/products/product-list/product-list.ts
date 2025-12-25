import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FakeStoreService, Product } from '../../../core/services/fake-store.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import {
  LucideAngularModule,
  Filter,
  Search,
  ChevronDown,
  SlidersHorizontal,
  X,
  Check,
  ShoppingBag,
} from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../../core/services/cart.service';

@Component({
    selector: 'app-product-list',
    imports: [CommonModule, FormsModule, ProductCardComponent, LucideAngularModule],
    templateUrl: './product-list.html',
    styles: [
        `
      :host {
        display: block;
        min-height: 100vh;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private storeService = inject(FakeStoreService);
  private cartService = inject(CartService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (params['search']) {
        this.searchQuery.set(params['search']);
      }
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });
  }

  trackByProduct(index: number, product: Product): number {
    return product.id;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Signals
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');
  selectedCategory = signal<string | null>(null);
  sortOption = signal<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  showMobileFilters = signal<boolean>(false);

  // Icons
  readonly Filter = Filter;
  readonly Search = Search;
  readonly ChevronDown = ChevronDown;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly X = X;
  readonly Check = Check;
  readonly ShoppingBag = ShoppingBag;

  // Computed filtered products
  filteredProducts = computed(() => {
    let result = this.products();

    // Filter by Category
    const category = this.selectedCategory();
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Filter by Search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    const sort = this.sortOption();
    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result = [...result].sort((a, b) => b.rating.rate - a.rating.rate);
    }

    return result;
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    // Load Categories
    this.storeService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Error loading categories', err),
    });

    // Load Products
    this.storeService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading.set(false);
      },
    });
  }

  setCategory(category: string | null) {
    this.selectedCategory.set(category);
    // this.showMobileFilters.set(false); // Close mobile menu on selection
  }

  setSort(option: string) {
    this.sortOption.set(option as any);
  }

  toggleMobileFilters() {
    this.showMobileFilters.update((v) => !v);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastr.success('Added to cart', product.title);
  }

  viewDeals() {
    this.setSort('price-asc');
    this.toastr.info('Sorted by price: Low to High', 'Deals');
  }
}
