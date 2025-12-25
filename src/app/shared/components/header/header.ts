import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  BarChart2,
  ShoppingBag,
} from 'lucide-angular';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ComparisonService } from '../../../core/services/comparison.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, FormsModule],
    templateUrl: './header.html'
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  cartService = inject(CartService);
  comparisonService = inject(ComparisonService);
  private router = inject(Router);

  isMobileMenuOpen = signal(false);
  isSearchOpen = signal(false);
  searchQuery = signal('');

  // Icons
  readonly ShoppingCart = ShoppingCart;
  readonly ShoppingBag = ShoppingBag;
  readonly User = User;
  readonly Search = Search;
  readonly Menu = Menu;
  readonly X = X;
  readonly Sun = Sun;
  readonly Moon = Moon;
  readonly LogOut = LogOut;
  readonly LayoutDashboard = LayoutDashboard;
  readonly BarChart2 = BarChart2;

  toggleTheme() {
    const current = this.themeService.theme();
    this.themeService.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleSearch() {
    this.isSearchOpen.update((v) => !v);
    if (!this.isSearchOpen()) {
      this.searchQuery.set('');
    }
  }

  onSearch() {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/products'], {
        queryParams: { search: query },
      });
      this.isSearchOpen.set(false);
      this.isMobileMenuOpen.set(false);
      this.searchQuery.set('');
    }
  }
}
