import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import {
  LucideAngularModule,
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  TicketPercent,
} from 'lucide-angular';

@Component({
    selector: 'app-cart-drawer',
    imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
    templateUrl: './cart-drawer.html',
    styleUrls: ['./cart-drawer.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  couponInput = signal('');

  readonly X = X;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly Minus = Minus;
  readonly Tag = Tag;
  readonly TicketPercent = TicketPercent;
  readonly ShoppingBag = ShoppingBag;

  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  applyCoupon() {
    if (this.couponInput()) {
      this.cartService.applyCoupon(this.couponInput());
      this.couponInput.set('');
    }
  }

  removeCoupon() {
    this.cartService.removeCoupon();
  }

  checkout() {
    this.cartService.closeCart();
    // Navigate to checkout
    this.router.navigate(['/checkout']);
  }

  handleImageError(event: any) {
    event.target.src = 'https://placehold.co/100x100?text=Product';
  }
}
