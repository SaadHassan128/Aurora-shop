import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    template: `
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <!-- Brand -->
          <div>
            <h3 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">Aurora</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Your premium destination for modern shopping. Quality products, fast delivery, and exceptional service.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Shop</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">New Arrivals</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">Best Sellers</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">Deals</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">Categories</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">Help Center</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">Returns</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">Shipping Info</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm">Contact Us</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Stay Updated</h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Subscribe to our newsletter for exclusive offers.</p>
            <div class="flex gap-2">
              <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-sm" />
              <button class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-gray-500 dark:text-gray-500 text-sm">© 2025 Aurora E-shop. All rights reserved.</p>
          <div class="flex space-x-4">
             <!-- Social icons would go here -->
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
