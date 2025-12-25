import { Component, signal, effect, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MessageCircle, X, Send, User, Bot } from 'lucide-angular';

interface Message {
  text: string;
  sender: 'user' | 'agent';
  time: Date;
}

@Component({
    selector: 'app-chat-widget',
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <!-- Chat Window -->
      <div
        *ngIf="isOpen()"
        class="mb-4 w-[350px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300 origin-bottom-right"
      >
        <!-- Header -->
        <div class="p-4 bg-primary text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <lucide-icon [img]="Bot" [size]="24"></lucide-icon>
              </div>
              <span
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-primary"
              ></span>
            </div>
            <div>
              <h3 class="font-bold">Aurora Support</h3>
              <p class="text-xs text-white/80">Online | Replies instantly</p>
            </div>
          </div>
          <button
            (click)="toggleChat()"
            class="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <lucide-icon [img]="X" [size]="20"></lucide-icon>
          </button>
        </div>

        <!-- Messages -->
        <div
          #scrollContainer
          class="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950"
        >
          <div
            *ngFor="let msg of messages()"
            class="flex gap-3"
            [class.flex-row-reverse]="msg.sender === 'user'"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              [class.bg-primary]="msg.sender === 'user'"
              [class.bg-white]="msg.sender === 'agent'"
              [class.dark:bg-slate-800]="msg.sender === 'agent'"
              [class.text-white]="msg.sender === 'user'"
              [class.text-primary]="msg.sender === 'agent'"
            >
              <lucide-icon [img]="msg.sender === 'user' ? User : Bot" [size]="16"></lucide-icon>
            </div>

            <div
              class="max-w-[80%] p-3 rounded-2xl text-sm"
              [class.bg-primary]="msg.sender === 'user'"
              [class.text-white]="msg.sender === 'user'"
              [class.rounded-tr-none]="msg.sender === 'user'"
              [class.bg-white]="msg.sender === 'agent'"
              [class.dark:bg-slate-800]="msg.sender === 'agent'"
              [class.text-slate-700]="msg.sender === 'agent'"
              [class.dark:text-slate-200]="msg.sender === 'agent'"
              [class.rounded-tl-none]="msg.sender === 'agent'"
              [class.shadow-sm]="msg.sender === 'agent'"
            >
              <p>{{ msg.text }}</p>
              <span
                class="text-[10px] opacity-70 mt-1 block"
                [class.text-right]="msg.sender === 'user'"
              >
                {{ msg.time | date : 'shortTime' }}
              </span>
            </div>
          </div>

          <div *ngIf="isTyping()" class="flex gap-3">
            <div
              class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-primary shrink-0"
            >
              <lucide-icon [img]="Bot" [size]="16"></lucide-icon>
            </div>
            <div
              class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1"
            >
              <span class="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
              <span class="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-100"></span>
              <span class="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800">
          <form (ngSubmit)="sendMessage()" class="flex gap-2">
            <input
              type="text"
              [(ngModel)]="newMessage"
              name="message"
              placeholder="Type your message..."
              class="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white"
            />
            <button
              type="submit"
              [disabled]="!newMessage.trim()"
              class="p-3 bg-primary text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
            >
              <lucide-icon [img]="Send" [size]="20"></lucide-icon>
            </button>
          </form>
        </div>
      </div>

      <!-- Toggle Button -->
      <button
        *ngIf="!isOpen()"
        (click)="toggleChat()"
        class="w-16 h-16 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-all duration-300 animate-bounce-slow"
      >
        <lucide-icon [img]="MessageCircle" [size]="32"></lucide-icon>
      </button>
    </div>
  `,
    styles: [
        `
      .animate-bounce-slow {
        animation: bounce 3s infinite;
      }
      @keyframes bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
    `,
    ]
})
export class ChatWidgetComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  isOpen = signal(false);
  newMessage = '';
  isTyping = signal(false);

  messages = signal<Message[]>([
    {
      text: 'Hi there! 👋 Welcome to Aurora. How can I help you today?',
      sender: 'agent',
      time: new Date(),
    },
  ]);

  // Icons
  readonly MessageCircle = MessageCircle;
  readonly X = X;
  readonly Send = Send;
  readonly User = User;
  readonly Bot = Bot;

  toggleChat() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    // User message
    const userMsg = this.newMessage;
    this.messages.update((msgs) => [
      ...msgs,
      {
        text: userMsg,
        sender: 'user',
        time: new Date(),
      },
    ]);
    this.newMessage = '';
    this.scrollToBottom();

    // Agent response simulation
    this.isTyping.set(true);
    this.scrollToBottom();

    setTimeout(() => {
      this.isTyping.set(false);
      this.messages.update((msgs) => [
        ...msgs,
        {
          text: this.getAutoResponse(userMsg),
          sender: 'agent',
          time: new Date(),
        },
      ]);
      this.scrollToBottom();
    }, 1500);
  }

  scrollToBottom() {
    if (this.scrollContainer) {
      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }, 0);
    }
  }

  getAutoResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('order') || lower.includes('shipping') || lower.includes('delivery')) {
      return "You can track your order in your Dashboard under 'Orders'. Shipping usually takes 3-5 business days.";
    }
    if (lower.includes('return') || lower.includes('refund')) {
      return 'We offer a 30-day hassle-free return policy. You can initiate a return from your order history.';
    }
    if (lower.includes('size') || lower.includes('fit')) {
      return 'Check out our Size Guide on any product page to find your perfect fit!';
    }
    if (lower.includes('discount') || lower.includes('coupon') || lower.includes('promo')) {
      return "Try using code 'WELCOME10' for 10% off your first order! 😉";
    }
    return 'Thanks for your message! Our support team will get back to you shortly. Is there anything else I can help with?';
  }
}
