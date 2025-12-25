import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { HomeComponent } from './features/home/home';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Aurora E-shop | Home',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then(
            (m) => m.ProductListComponent
          ),
        title: 'Shop Products',
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/products/product-detail/product-detail').then(
            (m) => m.ProductDetailComponent
          ),
        title: 'Product Details',
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/checkout/checkout').then((m) => m.CheckoutComponent),
        title: 'Checkout',
      },
      {
        path: 'compare',
        loadComponent: () =>
          import('./features/products/product-comparison/product-comparison.component').then(
            (m) => m.ProductComparisonComponent
          ),
        title: 'Compare Products',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
        canActivate: [authGuard],
        title: 'My Dashboard',
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then((m) => m.AdminDashboardComponent),
        title: 'Admin Dashboard',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders/orders').then((m) => m.AdminOrdersComponent),
        title: 'Order Management',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/products/products').then((m) => m.AdminProductsComponent),
        title: 'Product Management',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/users/users').then((m) => m.AdminUsersComponent),
        title: 'User Management',
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./features/admin/wishlist/wishlist').then((m) => m.AdminWishlistComponent),
        title: 'Wishlist Tracker',
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then((m) => m.RegisterComponent),
        title: 'Register',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
