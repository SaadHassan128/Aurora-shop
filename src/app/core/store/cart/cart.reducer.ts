import { createReducer, on } from '@ngrx/store';
import { CartItem, addToCart, removeFromCart, updateQuantity, clearCart, loadCart } from './cart.actions';

export interface CartState {
  items: CartItem[];
}

export const initialState: CartState = {
  items: []
};

export const cartReducer = createReducer(
  initialState,
  
  on(loadCart, (state) => {
    // In a real app, this might trigger an effect to load from storage
    // But for simplicity in reducer, we can't read localStorage directly (pure function)
    // We'll handle loading via Effects or initial state injection, 
    // but here we just keep state as is or let Effects hydrate it.
    // Actually, let's assume the Effect dispatches a 'loadCartSuccess' action.
    // For now, I'll rely on the Effect to initialize the state if I were using an API.
    // Since we use localStorage, we can initialize in the App initialization or Effect.
    return state; 
  }),

  on(addToCart, (state, { product, quantity = 1 }) => {
    const existingItem = state.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      return {
        ...state,
        items: state.items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }

    return {
      ...state,
      items: [...state.items, { product, quantity }]
    };
  }),

  on(removeFromCart, (state, { productId }) => ({
    ...state,
    items: state.items.filter(item => item.product.id !== productId)
  })),

  on(updateQuantity, (state, { productId, quantity }) => ({
    ...state,
    items: state.items.map(item => 
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    )
  })),

  on(clearCart, () => initialState)
);
