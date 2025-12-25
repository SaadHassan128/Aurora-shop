import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';
import { CartDrawerComponent } from '../../shared/components/cart-drawer/cart-drawer';
import { ChatWidgetComponent } from '../../shared/components/chat-widget/chat-widget.component';

@Component({
    selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        CartDrawerComponent,
        ChatWidgetComponent,
    ],
    template: `
    <div
      class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <app-header />
      <app-cart-drawer />
      <app-chat-widget />
      <main class="flex-grow pt-16">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `
})
export class MainLayoutComponent {}
