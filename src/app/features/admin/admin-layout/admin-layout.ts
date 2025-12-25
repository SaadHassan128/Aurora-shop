import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import {
  LucideAngularModule,
  LayoutDashboard,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  Package,
  Heart,
} from 'lucide-angular';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    HeaderComponent,
  ],
  templateUrl: './admin-layout.html',
})
export class AdminLayoutComponent {
  authService = inject(AuthService);

  // Icons
  readonly LayoutDashboard = LayoutDashboard;
  readonly ShoppingBag = ShoppingBag;
  readonly Users = Users;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly Package = Package;
  readonly Heart = Heart;

  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
  }
}
