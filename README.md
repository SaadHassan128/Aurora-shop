# Aurora E-Shop

<div align="center">

![Aurora E-Shop Logo](src/favicon-new.svg)

**A Modern, High-Performance E-Commerce Platform Built with Angular 19**

[![Angular](https://img.shields.io/badge/Angular-19.2-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![NgRx](https://img.shields.io/badge/NgRx-19.0-BA2BD2?style=for-the-badge&logo=ngrx)](https://ngrx.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Live Demo](https://aurora-shop.vercel.app) • [Report Bug](https://github.com/yourusername/aurora-shop/issues) • [Request Feature](https://github.com/yourusername/aurora-shop/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Performance Optimizations](#performance-optimizations)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Admin Panel](#admin-panel)
- [State Management](#state-management)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Aurora E-Shop** is a cutting-edge, fully-featured e-commerce platform built with the latest Angular 19 framework. It showcases modern web development best practices, including standalone components, signal-based reactivity, OnPush change detection, and advanced state management with NgRx.

The application provides a seamless shopping experience with features like product browsing, cart management, wishlist, product comparison, user authentication, and a comprehensive admin panel for managing products, orders, and users.

---

## Features

### Customer Features
- **Product Catalog**: Browse products with advanced filtering and sorting
- **Search Functionality**: Real-time product search
- **Product Details**: Comprehensive product views with ratings and reviews
- **Shopping Cart**: Full cart management with NgRx state management
- **Wishlist**: Save favorite products for later
- **Product Comparison**: Compare up to 4 products side-by-side
- **Checkout Process**: Streamlined checkout with coupon support
- **User Dashboard**: View orders, profile, and account settings
- **Recently Viewed**: Track recently browsed products
- **Flash Sales**: Time-limited offers with countdown timer
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Fully responsive UI for all devices
- **Live Chat Widget**: Customer support integration
- **Product Reviews**: Rate and review products

### Admin Features
- **Admin Dashboard**: Comprehensive analytics with charts
- **Product Management**: Full CRUD operations for products
- **Order Management**: Track and manage customer orders
- **User Management**: View and manage registered users
- **Wishlist Tracker**: Monitor popular wishlisted items
- **Analytics & Reports**: Visual data representation with Chart.js

---

## Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Angular** | 19.2.17 | Frontend Framework |
| **TypeScript** | 5.5.4 | Type-safe Development |
| **RxJS** | 7.8.0 | Reactive Programming |
| **NgRx** | 19.0.0 | State Management |
| **TailwindCSS** | 3.4.19 | Styling Framework |
| **Chart.js** | 4.5.1 | Data Visualization |
| **Lucide Angular** | 0.562.0 | Icon Library |
| **ngx-toastr** | 19.1.0 | Notifications |

### Build & Development Tools
- **Angular CLI**: 19.2.19
- **esbuild**: Latest (via @angular/build)
- **Node.js**: 24.x
- **npm**: 11.4.2

### Backend Integration
- **FakeStore API**: https://fakestoreapi.com (Demo API)
- **JWT Authentication**: Token-based auth system

---

## Performance Optimizations

Aurora E-Shop is built with performance as a top priority:

### ⚡ Change Detection Strategy
- **OnPush Change Detection**: Implemented across all components for optimal performance
- **Signal-based Reactivity**: Leveraging Angular 19 signals for fine-grained reactivity
- **Immutable State**: NgRx ensures predictable state updates

### 🚀 Bundle Optimization
- **Lazy Loading**: All routes are lazy-loaded to reduce initial bundle size
- **Code Splitting**: Automatic chunking for optimal load times
- **Tree Shaking**: Dead code elimination in production builds
- **Source Map**: Disabled in production for smaller bundles

### 📦 Build Configuration
```json
{
  "optimization": true,
  "sourceMap": false,
  "namedChunks": false,
  "extractLicenses": true,
  "outputHashing": "all"
}
```

### 🎯 Runtime Performance
- **Image Lazy Loading**: All product images use native lazy loading
- **trackBy Functions**: Optimized *ngFor loops with trackBy
- **HTTP Caching**: Implemented shareReplay for API calls
- **Service Worker Ready**: PWA-ready architecture

### 📊 Bundle Size Budgets
- **Initial Bundle**: Warning at 500kB, Error at 1MB
- **Component Styles**: Warning at 4kB, Error at 8kB

---

## Getting Started

### Prerequisites

- **Node.js** 24.x or higher
- **npm** 11.4.2 or higher
- **Angular CLI** 19.2.19 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aurora-shop.git
   cd aurora-shop
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:4200/
   ```

The app will automatically reload when you make changes to the source files.

---

## Project Structure

```
Aurora-Shop-V2-master/
├── src/
│   ├── app/
│   │   ├── core/                       # Core functionality
│   │   │   ├── constants/              # App-wide constants
│   │   │   ├── guards/                 # Route guards (auth, admin)
│   │   │   ├── interceptors/           # HTTP interceptors
│   │   │   ├── models/                 # TypeScript interfaces
│   │   │   ├── services/               # Business logic services
│   │   │   └── store/                  # NgRx store (cart state)
│   │   ├── features/                   # Feature modules
│   │   │   ├── admin/                  # Admin panel features
│   │   │   │   ├── dashboard/          # Analytics dashboard
│   │   │   │   ├── orders/             # Order management
│   │   │   │   ├── products/           # Product management
│   │   │   │   ├── users/              # User management
│   │   │   │   └── wishlist/           # Wishlist tracker
│   │   │   ├── auth/                   # Authentication
│   │   │   │   ├── login/              # Login component
│   │   │   │   └── register/           # Registration
│   │   │   ├── checkout/               # Checkout process
│   │   │   ├── dashboard/              # User dashboard
│   │   │   ├── home/                   # Landing page
│   │   │   └── products/               # Product features
│   │   │       ├── product-list/       # Product catalog
│   │   │       ├── product-detail/     # Product details
│   │   │       ├── product-comparison/ # Compare products
│   │   │       └── product-reviews/    # Reviews system
│   │   ├── layouts/                    # Layout components
│   │   │   ├── main-layout/            # Main app layout
│   │   │   └── auth-layout/            # Auth pages layout
│   │   ├── shared/                     # Shared components
│   │   │   └── components/             # Reusable components
│   │   │       ├── header/             # Navigation header
│   │   │       ├── footer/             # Footer
│   │   │       ├── cart-drawer/        # Slide-out cart
│   │   │       ├── product-card/       # Product card
│   │   │       ├── chat-widget/        # Live chat
│   │   │       └── ui/                 # UI components
│   │   ├── app.ts                      # Root component
│   │   ├── app.config.ts               # App configuration
│   │   └── app.routes.ts               # Route definitions
│   ├── environments/                   # Environment configs
│   ├── assets/                         # Static assets
│   ├── styles.scss                     # Global styles
│   ├── index.html                      # Main HTML file
│   └── main.ts                         # Application bootstrap
├── angular.json                        # Angular CLI config
├── package.json                        # Dependencies
├── tailwind.config.js                  # Tailwind config
├── tsconfig.json                       # TypeScript config
├── vercel.json                         # Vercel deployment config
└── README.md                           # This file
```

---

## Available Scripts

### Development
```bash
npm start              # Start dev server (http://localhost:4200)
npm run build          # Build for production
npm test               # Run unit tests
```

### Deployment
```bash
npm run vercel-build   # Build for Vercel deployment
npm run vercel-deploy  # Deploy to Vercel
```

---

## Deployment

### Vercel Deployment (Recommended)

Aurora E-Shop is optimized for Vercel deployment:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel deploy --prod
   ```

3. **Configure Environment**
   - The app automatically uses the optimized Vercel configuration
   - All routes are properly handled with SPA rewrites
   - Security headers are pre-configured
   - Static assets are cached for 1 year

### Vercel Configuration Highlights

```json
{
  "framework": "angular",
  "buildCommand": "npm run build",
  "outputDirectory": "dist/aurora-e-shop/browser",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### Other Deployment Options

The app can also be deployed to:
- **Netlify**: Use the same build command and output directory
- **Firebase Hosting**: Configure firebase.json with appropriate rewrites
- **AWS S3 + CloudFront**: Static hosting with CDN
- **GitHub Pages**: With appropriate base href configuration

---

## Admin Panel

### Access Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin1234`

**User Account:**
- Username: `johnd` (or any FakeStore API user)
- Password: `m38rmF$`

### Admin Features

The admin panel includes:
- **Dashboard**: Real-time analytics with Chart.js visualizations
- **Product Management**: Add, edit, delete products with modal interface
- **Order Tracking**: View and manage customer orders
- **User Management**: View user profiles and activities
- **Wishlist Analytics**: Track most wishlisted products

Access the admin panel at: `/admin/dashboard` (requires admin login)

---

## State Management

### NgRx Store Architecture

Aurora E-Shop uses NgRx for predictable state management:

```typescript
// Store Structure
{
  cart: {
    items: CartItem[]  // { product: Product, quantity: number }
  }
}

// Actions
- addToCart({ product, quantity })
- removeFromCart({ productId })
- updateQuantity({ productId, quantity })
- clearCart()

// Selectors
- selectCartItems
- selectCartCount
- selectCartTotal
```

### Signal-based Services

Modern Angular 19 signals are used throughout:
- `AuthService`: User authentication state
- `ThemeService`: Dark/light mode toggle
- `CartService`: Shopping cart UI state
- `WishlistService`: Wishlist management
- `ComparisonService`: Product comparison

---

## Key Features Implementation

### 1. Authentication & Authorization

- **JWT-based Authentication**: Secure token storage
- **Route Guards**: `authGuard` and `adminGuard`
- **HTTP Interceptor**: Auto-attaches JWT to requests
- **Role-based Access**: Admin vs. User permissions

### 2. Shopping Cart

- **NgRx State**: Centralized cart management
- **Persistent Storage**: Cart survives page refreshes
- **Coupon System**: Apply discount codes (WELCOME10, SAVE20, AURORA50)
- **Real-time Updates**: Instant quantity/price calculations

### 3. Product Features

- **Advanced Filtering**: By category, price, rating
- **Search**: Real-time product search
- **Comparison**: Compare up to 4 products
- **Reviews**: Rate and review products
- **Recently Viewed**: Track browsing history

### 4. UI/UX

- **Dark Mode**: System-wide theme toggle
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and micro-interactions
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: User feedback for actions

---

## Browser Support

Aurora E-Shop supports all modern browsers:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Angular Team**: For the amazing framework
- **TailwindCSS**: For the utility-first CSS framework
- **NgRx Team**: For state management solution
- **FakeStore API**: For demo product data
- **Lucide Icons**: For beautiful icons

---

## Contact & Support

- **Live Demo**: [https://aurora-shop.vercel.app](https://aurora-shop.vercel.app)
- **GitHub Issues**: [Report a bug or request a feature](https://github.com/yourusername/aurora-shop/issues)
- **Email**: support@aurora-eshop.com

---

<div align="center">

**Made with ❤️ using Angular 19**

[⬆ Back to Top](#aurora-e-shop)

</div>
