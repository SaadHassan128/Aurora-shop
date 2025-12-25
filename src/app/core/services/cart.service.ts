import { Injectable, inject, signal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { Product } from '../services/fake-store.service';
import * as CartActions from '../store/cart/cart.actions';
import * as CartSelectors from '../store/cart/cart.selectors';
import { ToastrService } from 'ngx-toastr';

import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private store = inject(Store);
  private toastr = inject(ToastrService);

  // UI State for Cart Drawer
  isOpen = signal<boolean>(false);

  // Coupon State
  couponCode = signal<string | null>(null);
  discountPercent = signal<number>(0);

  // Selectors
  cartItems$ = this.store.select(CartSelectors.selectCartItems);
  cartCount$ = this.store.select(CartSelectors.selectCartCount);
  cartTotal$ = this.store.select(CartSelectors.selectCartTotal);

  // Computed Total with Discount
  finalTotal$ = combineLatest([this.cartTotal$, toObservable(this.discountPercent)]).pipe(
    map(([total, discount]) => {
      return total * (1 - discount / 100);
    })
  );

  constructor() {}

  applyCoupon(code: string) {
    const normalizedCode = code.toUpperCase().trim();

    if (this.couponCode() === normalizedCode) {
      this.toastr.info('Coupon already applied');
      return;
    }

    let discount = 0;
    switch (normalizedCode) {
      case 'WELCOME10':
        discount = 10;
        break;
      case 'SAVE20':
        discount = 20;
        break;
      case 'AURORA50':
        discount = 50;
        break;
      default:
        this.toastr.error('Invalid coupon code');
        return;
    }

    this.couponCode.set(normalizedCode);
    this.discountPercent.set(discount);
    this.toastr.success(`Coupon ${normalizedCode} applied!`, `${discount}% Discount`);
  }

  removeCoupon() {
    this.couponCode.set(null);
    this.discountPercent.set(0);
    this.toastr.info('Coupon removed');
  }

  addToCart(product: Product, quantity: number = 1) {
    this.store.dispatch(CartActions.addToCart({ product, quantity }));
    this.openCart();
  }

  removeFromCart(productId: number) {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  updateQuantity(productId: number, quantity: number) {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  clearCart() {
    this.store.dispatch(CartActions.clearCart());
  }

  toggleCart() {
    this.isOpen.update((v) => !v);
  }

  openCart() {
    this.isOpen.set(true);
  }

  closeCart() {
    this.isOpen.set(false);
  }
}
