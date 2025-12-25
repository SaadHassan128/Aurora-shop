import { createAction, props } from '@ngrx/store';
import { Product } from '../../services/fake-store.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

export const loadCart = createAction('[Cart] Load Cart');

export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ product: Product; quantity?: number }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ productId: number }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');
